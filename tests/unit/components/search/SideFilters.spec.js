import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SideFilters from '@/components/search/SideFilters.vue';
import { defaultFacetNames } from '@/store/search';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

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
    ...options.mocks
  };
  const store = new Vuex.Store({
    modules: {
      search: {
        namespaced: true,
        state: {
          facets: [],
          userParams: {},
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
          setShowFiltersToggle: () => null
        }
      }
    }
  });
  return shallowMount(SideFilters, {
    localVue,
    mocks,
    router,
    store,
    propsData: options.propsData
  });
};

describe('components/search/SideFilters', () => {
  describe('computed', () => {
    describe('filterableFacets', () => {
      const facetNames = ['TYPE', 'COUNTRY'];
      const storeGetters = {
        facetNames: () => facetNames
      };

      it('includes facets from store, without static fields', () => {
        const wrapper = factory({ storeGetters });

        for (const facetName of facetNames) {
          expect(wrapper.vm.filterableFacets.some(facet => (facet.name === facetName) && !facet.staticFields));
        }
      });

      describe('when collection facet is enabled', () => {
        const storeState = { collectionFacetEnabled: true };

        it('includes collection facet first, with static fields', () => {
          const wrapper = factory({ storeGetters, storeState });

          const firstFacet = wrapper.vm.filterableFacets[0];
          expect(firstFacet.name).toBe('collection');
          expect(Array.isArray(firstFacet.staticFields));
        });
      });

      describe('when collection facet is disabled', () => {
        const storeState = { collectionFacetEnabled: false };

        it('omits collection facet', () => {
          const wrapper = factory({ storeGetters, storeState });

          expect(wrapper.vm.filterableFacets.some(facet => facet.name === 'collection')).toBe(false);
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
  });
});
