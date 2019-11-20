import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchForm from '../../../../components/search/SearchForm.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';
import nock from 'nock';
import * as entities from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter({
  routes: [
    { name: 'search', path: '/search' },
    { name: 'entity-type-all', path: '/entity/:type?/*' }
  ]
});
const routerPush = sinon.spy(router, 'push');
const factory = (options = {}) => mount(SearchForm, {
  localVue,
  router,
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
          query: 'cartography'
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
          query: 'cartography'
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
    const inputQueryAndSubmitForm = (wrapper, query) => {
      const form =  wrapper.find('form');
      const queryInputField = form.find('input[type="text"]');
      queryInputField.setValue(query);
      form.trigger('submit.prevent');
    };

    const newQuery = 'trees';

    context('with a selected entity suggestion', () => {
      const wrapper = factory();
      wrapper.setData({
        suggestions: parsedSuggestions,
        selectedSuggestion: 'http://data.europeana.eu/concept/base/227'
      });

      it('routes to the entity page', async() => {
        await inputQueryAndSubmitForm(wrapper, newQuery);

        routerPush.should.have.been.calledWith('/entity/topic/227-fresco');
      });
    });

    context('when on a search page', () => {
      const state = {
        active: true,
        query: '',
        view: 'grid'
      };
      const wrapper = factory({ store: store(state) });

      it('updates current route', async() => {
        await inputQueryAndSubmitForm(wrapper, newQuery);

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query: newQuery, page: 1, view: state.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });

    context('when not on a search page', () => {
      const state = {
        active: false,
        query: '',
        view: 'list'
      };
      const wrapper = factory({ store: store(state) });

      it('reroutes to search', async() => {
        await inputQueryAndSubmitForm(wrapper, newQuery);

        const newRouteParams = {
          path: '/search',
          query: { query: newQuery, page: 1, view: state.view }
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
