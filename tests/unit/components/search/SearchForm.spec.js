import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchForm from '../../../../components/search/SearchForm.vue';
import Vuex from 'vuex';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const factory = (options = {}) => mount(SearchForm, {
  localVue,
  store: options.store,
  mocks: {
    ...{
      $route: {
        path: '/search',
        name: 'search'
      },
      $router: [],
      $t: () => {},
      localePath: (opts) => opts
    }, ...(options.mocks || {})
  }
});

describe('components/search/SearchForm', () => {
  describe('query', () => {
    context('when on a search page', () => {
      const wrapper = factory({
        store: new Vuex.Store({
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
        store: new Vuex.Store({
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
      const route = {
        path: '/some-search-path'
      };
      const wrapper = factory({
        mocks: {
          $route: route
        },
        store: new Vuex.Store({
          state: {
            search: {
              active: true
            }
          }
        })
      });

      it('uses current route path', () => {
        wrapper.vm.routePath.should.eq(route.path);
      });
    });

    context('when not on a search page', () => {
      const route = {
        path: '/some-non-search-path'
      };
      const wrapper = factory({
        mocks: {
          $route: route
        },
        store: new Vuex.Store({
          state: {
            search: {
              active: false
            }
          }
        })
      });

      it('uses default search route path', () => {
        wrapper.vm.routePath.should.eql({ name: 'search' });
      });
    });
  });

  describe('form submission', () => {
    const state = {
      search: {
        active: true,
        query: '',
        view: 'grid'
      }
    };
    const mutations = {
      'search/setQuery': sinon.spy()
    };
    const store = new Vuex.Store({
      state,
      mutations,
      getters: {
        'search/activeView': (state) => state.search.view
      }
    });
    const wrapper = factory({ store });
    const form =  wrapper.find('form');
    const queryInputField = form.find('input[type="text"]');
    const newQuery = 'trees';
    queryInputField.setValue(newQuery);

    it('writes to the store', () => {
      form.trigger('submit.prevent');

      mutations['search/setQuery'].should.have.been.calledWith(state, newQuery);
    });

    it('routes to a new search', () => {
      form.trigger('submit.prevent');

      const newRoute = wrapper.vm.$router.slice(-1)[0];
      newRoute.path.should.eq('/search');
      newRoute.query.should.eql({ query: newQuery, page: 1, view: state.search.view });
    });
  });
});
