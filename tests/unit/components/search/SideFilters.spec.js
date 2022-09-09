import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SideFilters from '@/components/search/SideFilters.vue';

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
    $te: () => true,
    $features: { entityHeaderCards: true },
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
          apiParams: {},
          collectionFacetEnabled: true,
          liveQueries: [],
          ...options.searchStoreState
        },
        getters: {
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
    attachTo: document.body,
    mocks,
    router,
    store,
    propsData: options.propsData
  });
};

describe('components/search/SideFilters', () => {
  describe('template', () => {
    it('is wrapper in <section role="search">', () => {
      const wrapper = factory();

      const section = wrapper.find('section[role="search"]');

      expect(section.exists()).toBe(true);
    });

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
        const searchStoreState = {
          userParams: {
            qf: 'TYPE:"IMAGE"'
          }
        };
        const wrapper = factory({ searchStoreState });

        const resetButton = wrapper.find('[data-qa="reset filters button"]');

        expect(resetButton.exists()).toBe(true);
        expect(resetButton.attributes('disabled')).not.toBe('disabled');
      });

      it('is disabled while search queries are running', () => {
        const searchStoreState = {
          userParams: {
            qf: 'TYPE:"IMAGE"'
          },
          liveQueries: [{ query: 'river' }]
        };
        const wrapper = factory({ searchStoreState });

        const resetButton = wrapper.find('[data-qa="reset filters button"]');

        expect(resetButton.exists()).toBe(true);
        expect(resetButton.attributes('disabled')).toBe('disabled');
      });
    });

    describe('number of search results', () => {
      it('shows the total results', () => {
        const searchStoreState = {
          totalResults: 1000
        };

        const wrapper = factory({ searchStoreState });
        const totalResults = wrapper.find('[data-qa="total results"]');

        expect(totalResults.exists()).toBe(true);
      });

      it('does not show the total results', () => {
        const searchStoreState = {
          totalResults: null
        };

        const wrapper = factory({ searchStoreState });
        const totalResults = wrapper.find('[data-qa="total results"]');

        expect(totalResults.exists()).toBe(false);
      });
    });
  });

  describe('computed', () => {
    describe('filters()', () => {
      describe('with `null` query qf', () => {
        it('returns {}', async() => {
          const searchStoreState = {
            apiParams: {},
            userParams: {
              qf: null
            }
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual({});
        });
      });

      describe('with single query qf value', () => {
        it('returns it in an array on a property named for the facet', async() => {
          const searchStoreState = {
            apiParams: {},
            userParams: {
              qf: 'TYPE:"IMAGE"'
            }
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual({ 'TYPE': ['"IMAGE"'] });
        });
      });

      describe('with multiple query qf values', () => {
        it('returns them in arrays on properties named for each facet', async() => {
          const query = { qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:open'] };
          const expected = { 'TYPE': ['"IMAGE"', '"VIDEO"'], 'REUSABILITY': ['open'] };

          const searchStoreState = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });

      describe('with reusability values', () => {
        it('returns them in an array on REUSABILITY property', async() => {
          const query = { reusability: 'open,restricted' };
          const expected = { 'REUSABILITY': ['open', 'restricted'] };

          const searchStoreState = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });

      describe('with api value', () => {
        it('returns it as a string on api property', async() => {
          const query = { api: 'metadata' };
          const expected = { 'api': 'metadata' };

          const searchStoreState = {
            apiParams: query,
            userParams: {}
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });

      describe('with query that has two colons', () => {
        it('returns an array with a string seperated by a colon', async() => {
          const query = { qf: 'DATA_PROVIDER:"Galiciana: Biblioteca Digital de Galicia"' };
          const expected = { 'DATA_PROVIDER': ['"Galiciana: Biblioteca Digital de Galicia"'] };

          const searchStoreState = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ searchStoreState });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });
    });

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
            id: () => 'http://data.europeana.eu/concept/123'
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
          const searchStoreState = { collectionFacetEnabled: true };

          it('is included first, with static fields', () => {
            const wrapper = factory({ searchStoreGetters, searchStoreState });

            const firstFacet = wrapper.vm.filterableFacets[0];
            expect(firstFacet.name).toBe('collection');
            expect(Array.isArray(firstFacet.staticFields)).toBe(true);
          });
        });

        describe('when disabled', () => {
          const searchStoreState = { collectionFacetEnabled: false };

          it('is omitted', () => {
            const wrapper = factory({ searchStoreGetters, searchStoreState });

            expect(wrapper.vm.filterableFacets.some(facet => facet.name === 'collection')).toBe(false);
          });
        });
      });
    });

    describe('dateFilter', () => {
      it('is blank without a date filter', () => {
        const wrapper = factory();

        expect(wrapper.vm.dateFilter).toEqual({ start: null, end: null, specific: undefined });
      });

      it('is a range if date query filter value is a range', () => {
        const searchStoreState = {
          userParams: {
            qf: 'proxy_dcterms_issued:[1900-01-01 TO 1910-01-01]'
          }
        };
        const searchStoreGetters = {
          collection: () => 'newspaper'
        };
        const wrapper = factory({ searchStoreGetters, searchStoreState });

        expect(wrapper.vm.dateFilter).toEqual({ start: '1900-01-01', end: '1910-01-01', specific: false });
      });

      it('is a specific date if date query filter value is not a range', () => {
        const searchStoreState = {
          userParams: {
            qf: 'proxy_dcterms_issued:1900-01-01'
          }
        };
        const searchStoreGetters = {
          collection: () => 'newspaper'
        };
        const wrapper = factory({ searchStoreGetters, searchStoreState });

        expect(wrapper.vm.dateFilter).toEqual({ start: '1900-01-01', end: null, specific: true });
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

      describe('dateFilterField', () => {
        it('is "proxy_dcterms_issued"', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.dateFilterField).toBe('proxy_dcterms_issued');
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

      describe('dateFilterField', () => {
        it('is null', async() => {
          const wrapper = factory({ searchStoreGetters });
          expect(wrapper.vm.dateFilterField).toBe(null);
        });
      });
    });
  });

  describe('methods', () => {
    describe('changeFacet', () => {
      const facetName = 'TYPE';

      describe('when facet had selected values', () => {
        const initialSelectedValues = ['"IMAGE"'];
        const searchStoreState = {
          userParams: {
            qf: ['TYPE:"IMAGE"']
          }
        };

        describe('and they changed', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ searchStoreState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ searchStoreState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });

      describe('when facet had no selected values', () => {
        const searchStoreState = {
          userParams: {
            qf: []
          }
        };

        describe('and some were selected', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ searchStoreState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ searchStoreState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });
    });

    describe('queryUpdatesForFacetChanges', () => {
      const searchStoreGetters = {};

      describe('when facet is REUSABILITY', () => {
        describe('with values selected', () => {
          const selected = { 'REUSABILITY': ['open', 'permission'] };
          it('sets `reusability` to values joined with ","', () => {
            const wrapper = factory({ searchStoreGetters });

            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.reusability).toBe('open,permission');
          });
        });

        describe('with no values selected', () => {
          it('sets `reusability` to `null`', () => {
            const wrapper = factory({ searchStoreGetters });

            const updates = wrapper.vm.queryUpdatesForFacetChanges();

            expect(updates).toEqual({ qf: [], page: 1 });
          });
        });
      });

      describe('for default facets from search plugin supporting quotes', () => {
        it('includes fielded and quoted queries for each value in `qf`', () => {
          const wrapper = factory({ searchStoreGetters });
          const selected = { 'TYPE': ['"IMAGE"', '"SOUND"'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('TYPE:"IMAGE"');
          expect(updates.qf).toContain('TYPE:"SOUND"');
        });
      });

      describe('for default facets from search plugin not supporting quotes', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const wrapper = factory({ searchStoreGetters });
          const selected = { 'MIME_TYPE': ['application/pdf'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('MIME_TYPE:application/pdf');
        });
      });

      describe('for any other facets', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const wrapper = factory({ searchStoreGetters });
          const selected = { 'contentTier': ['4'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('contentTier:4');
        });
      });

      describe('in a collection having custom filters', () => {
        const searchStoreState = {
          userParams: {
            qf: ['proxy_dcterms_issued:1900-01-01']
          }
        };
        const searchStoreGetters = {
          collection: () => 'newspaper'
        };

        it('applies them', () => {
          const wrapper = factory({ searchStoreState, searchStoreGetters });
          const selected = { api: 'metadata', 'proxy_dcterms_issued': ['1900-01-02'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('proxy_dcterms_issued:1900-01-02');
          expect(updates.api).toBe('metadata');
        });
      });

      describe('with collection-specific facets already selected', () => {
        const searchStoreState = {
          userParams: {
            qf: [
              'CREATOR:"Missoni (Designer)"',
              'TYPE:"IMAGE"',
              'contentTier:*'
            ]
          }
        };
        const searchStoreGetters = {
          collection: () => 'fashion'
        };

        describe('when collection is changed', () => {
          const wrapper = factory({ searchStoreState, searchStoreGetters });
          const selected = { 'collection': 'art' };

          it('removes collection-specific facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('CREATOR:"Missoni (Designer)"');
          });

          it('preserves generic facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).toContain('TYPE:"IMAGE"');
          });

          it('removes tier filter', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('contentTier:*');
          });
        });

        describe('when collection is removed', () => {
          const wrapper = factory({ searchStoreState, searchStoreGetters });
          const selected = { 'collection': null };

          it('removes collection-specific facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('CREATOR:"Missoni (Designer)"');
          });

          it('preserves generic facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).toContain('TYPE:"IMAGE"');
          });
        });
      });
    });
  });
});
