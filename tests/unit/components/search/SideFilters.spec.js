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
    $tc: (key) => key,
    $features: { entityHeaderCards: true },
    $tFacetName: (key) => key,
    $path: () => '/',
    $goto: () => null,
    ...options.mocks
  };

  const store = new Vuex.Store({
    modules: {
      entity: {
        namespaced: true,
        getters: {
          id: () => null,
          ...options.entityStoreGetters
        }
      },
      search: {
        namespaced: true,
        state: {
          facets: [],
          userParams: {},
          collectionFacetEnabled: true,
          resettableFilters: [],
          liveQueries: [],
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
          ...options.searchStoreGetters
        },
        mutations: {
          setShowFiltersToggle: () => null
        },
        actions: {
          setResettableFilter: () => null
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
  describe('reset button', () => {
    it('is not present when no filters are selected', () => {
      const searchStoreGetters = {
        hasResettableFilters: () => false
      };
      const wrapper = factory({ searchStoreGetters });

      const resetButton = wrapper.find('[data-qa="reset filters button"]');

      expect(resetButton.exists()).toBe(false);
    });

    it('is present when filters are selected', () => {
      const searchStoreGetters = {
        hasResettableFilters: () => true
      };
      const wrapper = factory({ searchStoreGetters });

      const resetButton = wrapper.find('[data-qa="reset filters button"]');

      expect(resetButton.exists()).toBe(true);
      expect(resetButton.attributes('disabled')).not.toBe('disabled');
    });

    it('is disabled while search queries are running', () => {
      const searchStoreGetters = {
        hasResettableFilters: () => true
      };
      const storeState = {
        liveQueries: [{ query: 'river' }]
      };
      const wrapper = factory({ searchStoreGetters, storeState });

      const resetButton = wrapper.find('[data-qa="reset filters button"]');

      expect(resetButton.exists()).toBe(true);
      expect(resetButton.attributes('disabled')).toBe('disabled');
    });
  });

  describe('number of search results', () => {
    it('shows the total results', () => {
      const storeState = {
        totalResults: 1000
      };

      const wrapper = factory({ storeState });
      const totalResults = wrapper.find('[data-qa="total results"]');

      expect(totalResults.exists()).toBe(true);
    });

    it('does not show the total results', () => {
      const storeState = {
        totalResults: null
      };

      const wrapper = factory({ storeState });
      const totalResults = wrapper.find('[data-qa="total results"]');

      expect(totalResults.exists()).toBe(false);
    });
  });

  describe('computed', () => {
    describe('filterableFacets', () => {
      const facetNames = ['TYPE', 'COUNTRY'];
      const searchStoreGetters = {
        facetNames: () => facetNames
      };

      it('includes facets from store, without static fields', () => {
        const wrapper = factory({ searchStoreGetters });

        for (const facetName of facetNames) {
          expect(wrapper.vm.filterableFacets.some(facet => (facet.name === facetName) && !facet.staticFields)).toBe(true);
        }
      });

      describe('contentTier facet', () => {
        const facetNames = ['TYPE', 'COUNTRY', 'contentTier'];

        it('is included in the context of a thematic collection', () => {
          const searchStoreGetters = {
            facetNames: () => facetNames,
            collection: () => true
          };

          const wrapper = factory({ searchStoreGetters });

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(true);
        });

        it('is included in the context of a non-thematic collection', () => {
          const entityStoreGetters = {
            id: () => 'http://data.europeana.eu/base/concept/123'
          };
          const searchStoreGetters = {
            facetNames: () => facetNames
          };

          const wrapper = factory({ entityStoreGetters, searchStoreGetters });

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(true);
        });

        it('is excluded elsewhere', () => {
          const searchStoreGetters = {
            facetNames: () => facetNames
          };

          const wrapper = factory({ searchStoreGetters });

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(false);
        });
      });

      describe('collection facet', () => {
        describe('when enabled', () => {
          const storeState = { collectionFacetEnabled: true };

          it('is included first, with static fields', () => {
            const wrapper = factory({ searchStoreGetters, storeState });

            const firstFacet = wrapper.vm.filterableFacets[0];
            expect(firstFacet.name).toBe('collection');
            expect(Array.isArray(firstFacet.staticFields)).toBe(true);
          });
        });

        describe('when disabled', () => {
          const storeState = { collectionFacetEnabled: false };

          it('is omitted', () => {
            const wrapper = factory({ searchStoreGetters, storeState });

            expect(wrapper.vm.filterableFacets.some(facet => facet.name === 'collection')).toBe(false);
          });
        });
      });
    });

    describe('when on the newspaper collection', () => {
      const searchStoreGetters = {
        collection: () => 'newspaper',
        filters: () => ({})
      };

      describe('enableDateFilter', () => {
        it('is true', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableDateFilter).toBe(true);
        });
      });

      describe('dateFilterName', () => {
        it('is "proxy_dcterms_issued"', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.dateFilterName).toBe('proxy_dcterms_issued');
        });
      });

      describe('enableApiFilter', () => {
        it('is true', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableApiFilter).toBe(true);
        });
      });

      describe('apiFilterDefaultValue', () => {
        it('is "fulltext"', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.apiFilterDefaultValue).toBe('fulltext');
        });
      });
    });

    describe('when on the ww1 collection', () => {
      const searchStoreGetters = {
        collection: () => 'ww1',
        filters: () => ({})
      };

      describe('enableDateFilter', () => {
        it('is false', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableDateFilter).toBe(false);
        });
      });

      describe('enableApiFilter', () => {
        it('is true', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableApiFilter).toBe(true);
        });
      });

      describe('apiFilterDefaultValue', () => {
        it('is "metadata"', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.apiFilterDefaultValue).toBe('metadata');
        });
      });
    });

    describe('when on a collection without specific filters', () => {
      const searchStoreGetters = {
        collection: () => 'art',
        filters: () => ({})
      };

      describe('enableDateFilter', () => {
        it('is false', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableDateFilter).toBe(false);
        });
      });

      describe('enableApiFilter', () => {
        it('is false', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.enableApiFilter).toBe(false);
        });
      });

      describe('apiFilterDefaultValue', () => {
        it('is null', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.apiFilterDefaultValue).toBe(null);
        });
      });

      describe('dateFilterName', () => {
        it('is null', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.dateFilterName).toBe(null);
        });
      });
    });
  });

  describe('methods', () => {
    describe('changeFacet', () => {
      const facetName = 'TYPE';

      describe('when facet had selected values', () => {
        const initialSelectedValues = ['"IMAGE"'];
        const searchStoreGetters = {
          filters: () => {
            return { 'TYPE': ['"IMAGE"'] };
          }
        };

        describe('and they changed', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ searchStoreGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ searchStoreGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });

      describe('when facet had no selected values', () => {
        const searchStoreGetters = {
          filters: () => {
            return {};
          }
        };

        describe('and some were selected', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ searchStoreGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ searchStoreGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });
    });
  });
});
