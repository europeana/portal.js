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
    {
      path: '/search',
      name: 'search'
    }
  ]
});

const factory = (options = {}) => mount(SearchForm, {
  ...{
    localVue,
    router,
    mocks: {
      $t: () => {},
      localePath: (opts) => opts
    }
  }, ...options
});

describe('components/search/SearchForm', () => {
  describe('query', () => {
    context('when search is active', () => {
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

    context('when search is inactive', () => {
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

  describe('form submission', () => {
    const state = {
      search: {
        active: true,
        query: ''
      }
    };
    const mutations = {
      'search/setQuery': sinon.spy()
    };
    const store = new Vuex.Store({
      state,
      mutations
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

      wrapper.vm.$route.path.should.eq('/search');
      wrapper.vm.$route.query.should.eql({ query: newQuery, page: 1 });
    });
  });
});
