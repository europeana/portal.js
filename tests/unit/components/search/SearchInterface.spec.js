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
          collectionFacetEnabled: true,
          resettableFilters: [],
          ...options.storeState
        },
        getters: {
          facetNames() {
            return defaultFacetNames;
          },
          filters: () => {
            return {};
          },
          collection: () => null,
          queryUpdatesForFacetChanges: () => () => {
            return {};
          },
          ...options.storeGetters
        },
        mutations: {
          setUserParams: () => null,
          setView: (state, view) => searchSetViewMutation(state, view)
        },
        actions: {
          queryFacets: () => null,
          run: () => null,
          setResettableFilter: () => null
        }
      }
    }
  });
  return shallowMount(SearchInterface, {
    localVue,
    mocks,
    router,
    store,
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

        expect(errorNotice).exist;
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

    describe('orderedFacets', () => {
      const wrapper = factory({
        storeState: {
          facets: [
            { name: 'COUNTRY' },
            { name: 'RIGHTS' },
            { name: 'CONTRIBUTOR' },
            { name: 'DATA_PROVIDER' },
            { name: 'PROVIDER' },
            { name: 'LANGUAGE' },
            { name: 'REUSABILITY' },
            { name: 'TYPE' }
          ]
        }
      });

      it('injects collection first', () => {
        expect(wrapper.vm.orderedFacets[0].name).toBe('collection');
      });

      it('follows with ordered default facets from search plugin', () => {
        expect(wrapper.vm.orderedFacets[1].name).toBe('TYPE');
        expect(wrapper.vm.orderedFacets[2].name).toBe('REUSABILITY');
        expect(wrapper.vm.orderedFacets[3].name).toBe('COUNTRY');
        expect(wrapper.vm.orderedFacets[4].name).toBe('LANGUAGE');
        expect(wrapper.vm.orderedFacets[5].name).toBe('PROVIDER');
        expect(wrapper.vm.orderedFacets[6].name).toBe('DATA_PROVIDER');
      });

      it('ends with any other facets in their original order', () => {
        expect(wrapper.vm.orderedFacets[7].name).toBe('RIGHTS');
        expect(wrapper.vm.orderedFacets[8].name).toBe('CONTRIBUTOR');
      });
    });

    describe('coreFacets', () => {
      const wrapper = factory({
        storeState: {
          facets: [
            { name: 'COUNTRY' },
            { name: 'RIGHTS' },
            { name: 'CONTRIBUTOR' },
            { name: 'DATA_PROVIDER' },
            { name: 'PROVIDER' },
            { name: 'LANGUAGE' },
            { name: 'REUSABILITY' },
            { name: 'TYPE' }
          ]
        }
      });

      it('returns core facets only', () => {
        expect(wrapper.vm.coreFacets.map(coreFacet => coreFacet.name)).toEqual(['collection', 'TYPE', 'REUSABILITY', 'COUNTRY']);
      });
    });

    describe('moreFacets', () => {
      const wrapper = factory({
        storeState: {
          facets: [
            { name: 'COUNTRY' },
            { name: 'RIGHTS' },
            { name: 'CONTRIBUTOR' },
            { name: 'DATA_PROVIDER' },
            { name: 'PROVIDER' },
            { name: 'LANGUAGE' },
            { name: 'REUSABILITY' },
            { name: 'TYPE' }
          ]
        }
      });

      it('returns non-core facets only', () => {
        expect(wrapper.vm.moreFacets.map(moreFacet => moreFacet.name)).toEqual(['LANGUAGE', 'PROVIDER', 'DATA_PROVIDER']);
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
    describe('changeFacet', () => {
      const facetName = 'TYPE';

      describe('when facet had selected values', () => {
        const initialSelectedValues = ['"IMAGE"'];
        const storeGetters = {
          filters: () => {
            return { 'TYPE': ['"IMAGE"'] };
          }
        };

        describe('and they changed', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });

      describe('when facet had no selected values', () => {
        const storeGetters = {
          filters: () => {
            return {};
          }
        };

        describe('and some were selected', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });
    });

    describe('showContentTierToast', () => {
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
            beforeEach(() => {
              global.sessionStorage.removeItem('contentTierToastShown');
            });

            it('shows the toast', async() => {
              const wrapper = factory({
                storeState: { facets }
              });
              const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');
              await wrapper.vm.showContentTierToast();
              expect(rootBvToast.calledWith('facets.contentTier.notification', sinon.match.any)).toBe(true);
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
              const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

              await wrapper.vm.showContentTierToast();

              expect(rootBvToast.called).toBe(false);
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
            const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

            await wrapper.vm.showContentTierToast();

            expect(rootBvToast.called).toBe(false);
          });
        });
      });

      describe('when not in browser', () => {
        beforeEach(() => {
          process.browser = false;
        });

        it('does not show the toast', async() => {
          const wrapper = factory();
          const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

          await wrapper.vm.showContentTierToast();

          expect(rootBvToast.called).toBe(false);
        });
      });
    });
  });
});
