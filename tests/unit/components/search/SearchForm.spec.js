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
      localePath: (opts) => opts
    }, ...(options.mocks || {})
  },
  store: options.store || {}
});

const mutations = {
  'search/newQuery': sinon.spy()
};
const getters = {
  'search/activeView': (state) => state.search.view
};
const store = (options = {}) => {
  return new Vuex.Store({
    getters,
    mutations,
    state: options.state || {
      search: {}
    }
  });
};

describe('components/search/SearchForm', () => {
  describe('query', () => {
    context('when search is active', () => {
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

    context('when search is inactive', () => {
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

  describe('form submission', () => {
    const inputQueryAndSubmitForm = (wrapper, query) => {
      const form =  wrapper.find('form');
      const queryInputField = form.find('input[type="text"]');
      queryInputField.setValue(query);
      form.trigger('submit.prevent');
    };

    const newQuery = 'trees';

    it('triggers newQuery store mutation', () => {
      const state = {
        search: {
          active: true,
          query: ''
        }
      };
      const wrapper = factory({
        store: store({
          state
        })
      });

      inputQueryAndSubmitForm(wrapper, newQuery);

      mutations['search/newQuery'].should.have.been.calledWith(state, newQuery);
    });

    context('when search is active', () => {
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

      it('does not update routing', () => {
        inputQueryAndSubmitForm(wrapper, newQuery);

        routerPush.should.not.have.been.called;
      });
    });

    context('when search is inactive', () => {
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
          name: 'search',
          query: { query: newQuery, page: 1, view: state.search.view }
        };
        routerPush.should.have.been.calledWith(newRouteParams);
      });
    });
  });
});
