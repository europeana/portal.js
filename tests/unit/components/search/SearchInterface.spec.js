import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import SearchInterface from '@/components/search/SearchInterface.vue';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.filter('optimisedImageUrl', (string) => string);
localVue.use(BootstrapVue);
localVue.use(Vuex);

const searchSetViewMutation = sinon.spy();
const searchSetMutation = sinon.spy();
const makeToastSpy = sinon.spy();

const factory = (options = {}) => {
  const mocks = {
    $t: (key) => key,
    $path: () => '/',
    $goto: () => null,
    $features: { sideFilters: false, entityHeaderCards: false },
    $fetchState: options.fetchState || {},
    $route: { path: '/search', name: 'search', query: {} },
    localise: (val) => val,
    ...options.mocks
  };

  const store = new Vuex.Store({
    modules: {
      search: {
        namespaced: true,
        state: {
          facets: [],
          userParams: {},
          apiParams: {},
          results: [],
          entity: {},
          ...options.storeState
        },
        getters: {
          filters: () => ({}),
          ...options.storeGetters
        },
        mutations: {
          set: searchSetMutation,
          setUserParams: () => null,
          setView: searchSetViewMutation
        },
        actions: {
          run: () => null
        }
      }
    }
  });

  const mixins = [
    {
      methods: {
        makeToast: makeToastSpy
      }
    }
  ];

  return shallowMount(SearchInterface, {
    localVue,
    mocks,
    store,
    mixins,
    propsData: options.propsData
  });
};

describe('components/search/SearchInterface', () => {
  beforeEach(() => sinon.resetHistory());

  describe('output', () => {
    describe('with `error` in search state', () => {
      it('displays the message', () => {
        const errorMessage = 'Something went very wrong';
        const wrapper = factory({
          storeState: {
            error: errorMessage
          }
        });

        const errorNotice = wrapper.find(`[error="${errorMessage}"]`);

        expect(errorNotice).toBeDefined();
      });
    });
  });

  describe('computed properties', () => {
    describe('errorMessage', () => {
      describe('when there was a pagination error', () => {
        it('returns a user-friendly error message', async() => {
          const wrapper = factory({
            fetchState: {
              error: {
                message: 'Sorry! It is not possible to paginate beyond the first 5000 search results.'
              }
            }
          });

          expect(wrapper.vm.errorMessage).toBe('messages.paginationLimitExceeded');
        });
      });
    });

    describe('noMoreResults', () => {
      describe('when there are 0 results in total', () => {
        const wrapper = factory({
          storeState: { totalResults: 0 }
        });

        it('is `false`', () => {
          expect(wrapper.vm.noMoreResults).toBe(false);
        });
      });

      describe('when there are some results in total', () => {
        describe('and results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100,
              results: [
                {
                  europeanaId: '/123/abc',
                  dcTitle: { def: ['Record 123/abc'] },
                  edmPreview: 'https://www.example.org/abc.jpg',
                  edmDataProvider: ['Provider 123']
                }
              ]
            }
          });

          it('is `false`', () => {
            expect(wrapper.vm.noMoreResults).toBe(false);
          });
        });

        describe('but no results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100
            }
          });

          it('is `true`', () => {
            expect(wrapper.vm.noMoreResults).toBe(true);
          });
        });
      });
    });

    describe('view', () => {
      describe('setter', () => {
        it('commits to the search store', () => {
          const wrapper = factory();
          const view = 'list';

          wrapper.vm.view = view;

          expect(searchSetViewMutation.calledWith(sinon.match.any, view)).toBe(true);
        });
      });
    });
  });

  describe('methods', () => {
    describe('viewFromRouteQuery', () => {
      describe('with view in route query', () => {
        const route = { query: { view: 'mosaic', query: 'sport' } };

        it('updates the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetViewMutation.calledWith(sinon.match.any, 'mosaic')).toBe(true);
        });

        it('sets searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
        });

        it('commit route query to store as userParams', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetMutation.calledWith(
            sinon.match.any, ['userParams', sinon.match(route.query)]
          )).toBe(true);
        });
      });

      describe('without view in route query', () => {
        const route = { query: { query: 'sport' } };

        it('does not update the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });
          sinon.resetHistory();

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetViewMutation.called).toBe(false);
        });

        it('does not set searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.called).toBe(false);
        });

        it('does not commit route query to store as userParams', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetMutation.called).toBe(false);
        });
      });
    });
  });
});
