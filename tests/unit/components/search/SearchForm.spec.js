import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchForm from '../../../../components/search/SearchForm.vue';
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
const factory = (options = {}) => mount(SearchForm, {
  localVue,
  router,
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

const getters = {
  'search/activeView': (state) => state.search.view
};
const store = (options = {}) => {
  return new Vuex.Store({
    getters,
    state: options.state || {
      search: {}
    }
  });
};

describe('components/search/SearchForm', () => {
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
});
