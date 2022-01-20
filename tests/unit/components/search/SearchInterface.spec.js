import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SearchInterface from '@/components/search/SearchInterface.vue';
import { defaultFacetNames } from '@/store/search';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.filter('optimisedImageUrl', (string) => string);
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const searchSetViewMutation = sinon.spy();
const makeToastSpy = sinon.spy();

const factory = (options = {}) => {
  const router = new VueRouter({
    routes: [
      {
        path: '/search',
        name: 'search'
      },
      {
        path: '/item/*',
        name: 'item-all'
      }
    ]
  });

  const mocks = {
    $t: (key) => key,
    $path: () => '/',
    $goto: () => null,
    $features: { sideFilters: false },
    $fetchState: options.fetchState || {},
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
          ...options.storeState
        },
        getters: {
          filters: () => ({}),
          ...options.storeGetters
        },
        mutations: {
          setUserParams: () => null,
          setView: (state, view) => searchSetViewMutation(state, view)
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
    router,
    store,
    mixins,
    propsData: options.propsData
  });
};

describe('components/search/SearchInterface', () => {
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
    describe('showContentTierToast', () => {
      beforeEach(() => {
        makeToastSpy.resetHistory();
      });
      let facets = [];

      describe('in browser', () => {
        beforeEach(() => {
          process.browser = true;
        });

        describe('with contentTier "0" facet field', () => {
          beforeEach(() => {
            facets = [
              { name: 'contentTier', fields: [{ label: '"0"' }] }
            ];
          });

          describe('when toast has not yet been shown this session', () => {
            beforeEach(async() => {
              global.sessionStorage.removeItem('contentTierToastShown');
            });

            it('shows the toast', async() => {
              const wrapper = factory({
                storeState: { facets }
              });
              await wrapper.vm.showContentTierToast();

              expect(makeToastSpy.calledWith('facets.contentTier.notification')).toBe(true);
            });

            it('updates session storage after toast is shown', async() => {
              const wrapper = factory({
                storeState: { facets }
              });
              await wrapper.vm.showContentTierToast();
              await wrapper.vm.$root.$emit('bv::toast:shown');

              expect(global.sessionStorage.getItem('contentTierToastShown')).toEqual('true');
            });
          });

          describe('when toast has previously been shown this session', () => {
            beforeEach(() => {
              global.sessionStorage.setItem('contentTierToastShown', 'true');
            });

            it('does not show the toast', async() => {
              const wrapper = factory({
                storeState: { facets }
              });

              await wrapper.vm.showContentTierToast();

              expect(makeToastSpy.calledWith('facets.contentTier.notification')).toBe(false);
            });
          });
        });

        describe('without contentTier 0 facet field', () => {
          beforeEach(() => {
            facets = [
              { name: 'contentTier', fields: [{ label: '"1"' }] }
            ];
          });

          it('does not show the toast', async() => {
            const wrapper = factory({
              storeState: { facets }
            });

            await wrapper.vm.showContentTierToast();

            expect(makeToastSpy.calledWith('facets.contentTier.notification')).toBe(false);
          });
        });
      });

      describe('when not in browser', () => {
        beforeEach(() => {
          process.browser = false;
        });

        it('does not show the toast', async() => {
          const wrapper = factory();

          await wrapper.vm.showContentTierToast();

          expect(makeToastSpy.calledWith('facets.contentTier.notification')).toBe(false);
        });
      });
    });
  });
});
