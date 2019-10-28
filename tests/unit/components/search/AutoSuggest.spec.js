import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AutoSuggest from '../../../../components/search/AutoSuggest.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter({
  routes: [
    { name: 'search', path: '/search' }
  ]
});

const routerPush = sinon.spy(router, 'push');
const factory = (options = {}) => {
  return mount(AutoSuggest, {
    localVue,
    router: options.router || router,
    mocks: {
      ...{
        $t: () => {},
        localePath: (opts) => {
          return router.resolve(opts).route.fullPath;
        }
      }, ...(options.mocks || {})
    },
    store: options.store || {}
  });
};

const getters = {
  'search/activeView': (state) => state.search.view
};
const store = (options = {}) => {
  return new Vuex.Store({
    getters,
    state: options.state || {
      search: {},
      entity: {
        id: null
      }
    }
  });
};

describe('components/search/AutoSuggest', () => {
  describe('query', () => {
    context('when on a search page', () => {
      const wrapper = factory({
        store: store({
          state: {
            search: {
              active: true,
              query: 'cartography'
            }
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
          state: {
            search: {
              active: false,
              query: 'cartography'
            }
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
          state: {
            search: {
              active: true
            }
          }
        })
      });

      it('uses current route path', () => {
        wrapper.vm.routePath.should.eq(wrapper.vm.$route.path);
      });
    });

    context('when not on a search page', () => {
      const wrapper = factory({
        store: store({
          state: {
            search: {
              active: false
            }
          }
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

    context('when on a search page', () => {
      const state = {
        search: {
          active: true,
          query: '',
          view: 'grid'
        }
      };
      const wrapper = factory({
        store: store({
          state
        })
      });

      it('updates current route', async() => {
        await inputQueryAndSubmitForm(wrapper, newQuery);

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query: newQuery, page: 1, view: state.search.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });

    context('when not on a search page', () => {
      const state = {
        search: {
          active: false,
          query: '',
          view: 'list'
        }
      };
      const wrapper = factory({
        store: store({
          state
        })
      });

      it('reroutes to search', async() => {
        await inputQueryAndSubmitForm(wrapper, newQuery);

        const newRouteParams = {
          path: '/search',
          query: { query: newQuery, page: 1, view: state.search.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });
  });

  describe('auto suggestion', async() => {
    const wrapper = factory({
      store: store({
        state: {
          search: {
            active: false,
            query: ''
          }
        }
      })
    });
    const getSuggestions = sinon.spy(wrapper.vm, 'getSuggestions');
    const searchBox = wrapper.find('[data-qa="search box"]');

    it('call `getSuggestions` method when user types into search box', () => {
      wrapper.setData({ query: 'World' });
      searchBox.trigger('input');

      getSuggestions.should.have.callCount(1);

    });

    it('disables autosuggestion if user is on `entity` page', () => {
      const wrapper = factory({
        store: store({
          state: {
            search: {
              active: false,
              query: ''
            },
            entity: {
              id: 'ghghghghg'
            }
          }
        })
      });

      wrapper.setData({ query: 'World' });
      wrapper.vm.getSuggestions();
      wrapper.vm.options.should.eql({});
    });

    it('returns zero options when there are less than 3 characters in search form', () => {
      wrapper.setData({ query: 'Wo' });
      wrapper.vm.getSuggestions();

      wrapper.vm.options.should.eql({});
    });

    it('returns options when there are 3 or more characters in search form', () => {
      wrapper.setData({ query: 'World' });
      wrapper.vm.getSuggestions();

      wrapper.vm.options.should.eql({
        'http://data.europeana.eu/concept/base/83': 'World War I',
        'http://data.europeana.eu/concept/base/94': 'Architecture'
      });
    });

    it('highlights matching characters', () => {
      const suggestion = wrapper.find('[data-qa="search suggestion world war i link"]');

      wrapper.setData({ query: 'world' });
      suggestion.html().should.contain('<strong class="highlight">World</strong>');
      wrapper.setData({ query: 'World' });
      suggestion.html().should.contain('<strong class="highlight">World</strong>');
      wrapper.setData({ query: 'WORLD' });
      suggestion.html().should.contain('<strong class="highlight">World</strong>');
      wrapper.setData({ query: 'Wor' });
      suggestion.html().should.contain('<strong class="highlight">Wor</strong>ld');
    });

    it('allows the user to navigate through suggestions using keyboards up and down arrows', async() => {
      const form =  wrapper.find('form');

      wrapper.setData({ query: 'World' });
      form.trigger('keyup.down');
      wrapper.vm.focus.should.eq(0);
      form.trigger('keyup.down');
      wrapper.vm.focus.should.eq(1);
      form.trigger('keyup.up');
      wrapper.vm.focus.should.eq(0);
    });
  });
});
