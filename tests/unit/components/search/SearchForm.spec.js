import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchForm from '../../../../components/search/SearchForm.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';
import nock from 'nock';
import * as entities from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter({
  routes: [
    { name: 'search', path: '/search' },
    { name: 'entity-type-all', path: '/entity/:type?/*' }
  ]
});
const routerPush = sinon.spy(router, 'push');
const factory = (options = {}) => shallowMount(SearchForm, {
  localVue,
  router,
  stubs: ['b-button', 'b-input-group', 'b-button', 'b-form', 'b-form-input'],
  mocks: {
    ...{
      $i18n: { locale: 'en' },
      $t: () => {},
      localePath: (opts) => {
        return router.resolve(opts).route.fullPath;
      }
    }, ...(options.mocks || {})
  },
  store: options.store || store({ search: {} })
});

const getters = {
  'search/activeView': (state) => state.search.view
};
const store = (searchState = {}) => {
  return new Vuex.Store({
    getters,
    state: {
      i18n: { locale: 'en' },
      search: searchState
    }
  });
};

const entityApiSuggestionsResponse = {
  'items': [
    {
      'id': 'http://data.europeana.eu/concept/base/227',
      'type': 'Concept',
      'prefLabel': {
        'en': 'Fresco'
      }
    },
    {
      'id': 'http://data.europeana.eu/agent/base/59981',
      'type': 'Agent',
      'prefLabel': {
        'en': 'Frank Sinatra'
      }
    }
  ]
};
const parsedSuggestions = {
  'http://data.europeana.eu/concept/base/227': { en: 'Fresco' },
  'http://data.europeana.eu/agent/base/59981': { en: 'Frank Sinatra' }
};

describe('components/search/SearchForm', () => {
  describe('query', () => {
    context('when on a search page', () => {
      const wrapper = factory({
        store: store({
          active: true,
          userParams: {
            query: 'cartography'
          }
        })
      });

      it('uses stored query', () => {
        wrapper.vm.query.should.eq('cartography');
      });
    });

    context('when not on a search page', () => {
      const wrapper = factory({
        store: store({
          active: false,
          userParams: {
            query: 'cartography'
          }
        })
      });

      it('is empty', () => {
        wrapper.vm.query.should.eq('');
      });
    });
  });

  describe('routePath', () => {
    context('when on a search page', () => {
      const wrapper = factory({
        store: store({
          active: true
        })
      });

      it('uses current route path', () => {
        wrapper.vm.routePath.should.eq(wrapper.vm.$route.path);
      });
    });

    context('when not on a search page', () => {
      const wrapper = factory({
        store: store({
          active: false
        })
      });

      it('uses default search route path', () => {
        wrapper.vm.routePath.should.eql('/search');
      });
    });
  });

  describe('form submission', () => {
    const query = 'trees';

    context('with a selected entity suggestion', () => {
      it('routes to the entity page', async() => {
        const wrapper = factory();

        wrapper.setData({
          suggestions: parsedSuggestions,
          selectedSuggestion: 'http://data.europeana.eu/concept/base/227',
          query
        });
        wrapper.vm.submitForm();

        routerPush.should.have.been.calledWith('/entity/topic/227-fresco');
      });
    });

    context('when on a search page', () => {
      it('updates current route', () => {
        const state = {
          active: true,
          userParams: {
            query: ''
          },
          view: 'grid'
        };
        const wrapper = factory({ store: store(state) });

        wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query, page: 1, view: state.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });

    context('when not on a search page', () => {
      it('reroutes to search', () => {
        const state = {
          active: false,
          userParams: {
            query: ''
          },
          view: 'list'
        };
        const wrapper = factory({ store: store(state) });

        wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: state.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });
  });

  describe('suggestionLinkGen', () => {
    const wrapper = factory();
    wrapper.setData({ suggestions: parsedSuggestions });

    it('generates agent entity URLs', () => {
      wrapper.vm.suggestionLinkGen('http://data.europeana.eu/agent/base/59981').should.eq('/entity/person/59981-frank-sinatra');
    });

    it('generates concept entity URLs', () => {
      wrapper.vm.suggestionLinkGen('http://data.europeana.eu/concept/base/227').should.eq('/entity/topic/227-fresco');
    });
  });

  describe('getSearchSuggestions', () => {
    beforeEach(() => {
      nock(entities.constants.API_ORIGIN).get('/entity/suggest')
        .query(true)
        .reply(200, entityApiSuggestionsResponse);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    context('auto-suggest is not enabled (by default)', () => {
      const wrapper = factory();
      it('does not get suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions();

        nock.isDone().should.not.be.true;
      });
    });

    context('auto-suggest is enabled (by prop)', () => {
      const wrapper = factory();
      wrapper.setProps({ enableAutoSuggest: true });

      it('gets suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions();

        nock.isDone().should.be.true;
      });

      // FIXME
      // it('parses and stores suggestions locally', async() => {
      //   await wrapper.vm.getSearchSuggestions();
      //
      //   wrapper.vm.suggestions.should.deep.eq(parsedSuggestions);
      // });
    });
  });
});
