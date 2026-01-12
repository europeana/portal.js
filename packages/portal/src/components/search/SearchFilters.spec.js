import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchFilters from '@/components/search/SearchFilters.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMount(SearchFilters, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key, arg) => arg?.count ? key + '-' + arg.count : key,
    $tc: (key) => key,
    $te: () => true,
    $features: {},
    localePath: () => '/',
    ...options.mocks,
    $matomo: {
      trackEvent: sinon.spy()
    },
    $route: { query: {} },
    $router: { push: sinon.spy() },
    $store: {
      commit: sinon.spy(),
      getters: {
        'entity/id': null,
        ...options.mocks?.$store?.getters
      },
      state: {
        search: {
          collectionFacetEnabled: true,
          showSearchSidebar: false
        },
        ...options.mocks?.$store?.state
      }
    }
  },
  propsData: options.propsData
});

describe('components/search/SearchFilters', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('filters title', () => {
      describe('with advanced search', () => {
        it('has a level 2 heading', () => {
          const wrapper = factory();

          const h2 = wrapper.find('h2');

          expect(h2.text()).toBe('searchFilters');
        });
        describe('and when filter(s) are selected', () => {
          it('has a level 2 heading with selected filters count', () => {
            const propsData = {
              userParams: {
                qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:open']
              }
            };
            const wrapper = factory({ propsData });

            const h2 = wrapper.find('h2');

            expect(h2.text()).toBe('searchFilters-(2)');
          });
        });
      });
    });

    describe('reset button', () => {
      it('is not present when no filters are selected', () => {
        const wrapper = factory();

        const resetButton = wrapper.find('[data-qa="reset filters button"]');

        expect(resetButton.exists()).toBe(false);
      });

      it('is present when filters are selected', () => {
        const propsData = {
          userParams: {
            qf: 'TYPE:"IMAGE"'
          }
        };
        const wrapper = factory({ propsData });

        const resetButton = wrapper.find('[data-qa="reset filters button"]');

        expect(resetButton.exists()).toBe(true);
        expect(resetButton.attributes('disabled')).not.toBe('disabled');
      });
    });
  });

  describe('computed', () => {
    describe('filters()', () => {
      describe('with `null` query qf', () => {
        it('returns {}', async() => {
          const propsData = {
            apiParams: {},
            userParams: {
              qf: null
            }
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filters).toEqual({});
        });
      });

      describe('with single query qf value', () => {
        it('returns it in an array on a property named for the facet', async() => {
          const propsData = {
            apiParams: {},
            userParams: {
              qf: 'TYPE:"IMAGE"'
            }
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filters).toEqual({ 'TYPE': ['"IMAGE"'] });
        });
      });

      describe('with multiple query qf values', () => {
        it('returns them in arrays on properties named for each facet', async() => {
          const query = { qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:open'] };
          const expected = { 'TYPE': ['"IMAGE"', '"VIDEO"'], 'REUSABILITY': ['open'] };

          const propsData = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });

      describe('with reusability values', () => {
        it('returns them in an array on REUSABILITY property', async() => {
          const query = { reusability: 'open,restricted' };
          const expected = { 'REUSABILITY': ['open', 'restricted'] };

          const propsData = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });

      describe('with query that has two colons', () => {
        it('returns an array with a string seperated by a colon', async() => {
          const query = { qf: 'DATA_PROVIDER:"Galiciana: Biblioteca Digital de Galicia"' };
          const expected = { 'DATA_PROVIDER': ['"Galiciana: Biblioteca Digital de Galicia"'] };

          const propsData = {
            apiParams: {},
            userParams: query
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filters).toEqual(expected);
        });
      });
    });

    describe('filterableFacets', () => {
      const facetNames = ['TYPE', 'COUNTRY'];

      it('includes facets from store, without static fields', () => {
        const wrapper = factory();

        for (const facetName of facetNames) {
          expect(wrapper.vm.filterableFacets.some(facet => (facet.name === facetName) && !facet.staticFields)).toBe(true);
        }
      });

      describe('contentTier facet', () => {
        it('is included in the context of a thematic collection', () => {
          const propsData = {
            collection: 'art'
          };

          const wrapper = factory({ propsData });

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(true);
        });

        it('is included in the context of a non-thematic collection', () => {
          const mocks = {
            $store: { getters: { 'entity/id': 'http://data.europeana.eu/concept/123' } }
          };

          const wrapper = factory({ mocks });

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(true);
        });

        it('is excluded elsewhere', () => {
          const wrapper = factory();

          expect(wrapper.vm.filterableFacets.some((facet) => facet.name === 'contentTier')).toBe(false);
        });
      });

      describe('collection facet', () => {
        describe('when enabled', () => {
          const mocks = { $store: { state: { search: { collectionFacetEnabled: true } } } };

          it('is included first, with static fields', () => {
            const wrapper = factory({ mocks });

            const firstFacet = wrapper.vm.filterableFacets[0];
            expect(firstFacet.name).toBe('collection');
            expect(Array.isArray(firstFacet.staticFields)).toBe(true);
          });
        });

        describe('when disabled', () => {
          const mocks = { $store: { state: { search: { collectionFacetEnabled: false } } } };

          it('is omitted', () => {
            const wrapper = factory({ mocks });

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
        const propsData = {
          userParams: {
            qf: 'proxy_dcterms_issued:[1900-01-01 TO 1910-01-01]'
          },
          collection: 'newspaper'
        };
        const wrapper = factory({ propsData });

        expect(wrapper.vm.dateFilter).toEqual({ start: '1900-01-01', end: '1910-01-01', specific: false });
      });

      it('is a specific date if date query filter value is not a range', () => {
        const propsData = {
          userParams: {
            qf: 'proxy_dcterms_issued:1900-01-01'
          },
          collection: 'newspaper'
        };
        const wrapper = factory({ propsData });

        expect(wrapper.vm.dateFilter).toEqual({ start: '1900-01-01', end: null, specific: true });
      });
    });

    describe('when on the newspaper collection', () => {
      const propsData = {
        collection: 'newspaper'
      };

      describe('enableDateFilter', () => {
        it('is true', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.enableDateFilter).toBe(true);
        });
      });

      describe('enableSortFilter', () => {
        it('is true', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.enableSortFilter).toBe(true);
        });
      });

      describe('dateFilterField', () => {
        it('is "proxy_dcterms_issued"', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.dateFilterField).toBe('proxy_dcterms_issued');
        });
      });

      describe('sortFilterField', () => {
        it('is "proxy_dcterms_issued"', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.sortFilterField).toBe('proxy_dcterms_issued');
        });
      });
    });

    describe('when on a collection without specific filters', () => {
      const propsData = {
        collection: 'art'
      };

      describe('enableDateFilter', () => {
        it('is false', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.enableDateFilter).toBe(false);
        });
      });

      describe('dateFilterField', () => {
        it('is null', async() => {
          const wrapper = factory({ propsData });
          expect(wrapper.vm.dateFilterField).toBe(null);
        });
      });
    });
  });

  describe('methods', () => {
    describe('rerouteSearch', () => {
      it('stores that the interaction is loggable', () => {
        const wrapper = factory();

        wrapper.vm.rerouteSearch();

        expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
      });

      it('updates the route', () => {
        const wrapper = factory();

        wrapper.vm.rerouteSearch();

        expect(wrapper.vm.$router.push.called).toBe(true);
      });

      it('tracks each qf filter in Matomo', () => {
        const wrapper = factory();

        wrapper.vm.rerouteSearch({
          qf: [
            'TYPE:"IMAGE"',
            'LANGUAGE:"DE"'
          ]
        });

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Filters', 'Filter selected', 'TYPE:"IMAGE"')).toBe(true);
        expect(wrapper.vm.$matomo.trackEvent.calledWith('Filters', 'Filter selected', 'LANGUAGE:"DE"')).toBe(true);
      });

      it('tracks reusability filter in Matomo', () => {
        const wrapper = factory();

        wrapper.vm.rerouteSearch({
          reusability: 'open'
        });

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Filters', 'Reusability filter selected', 'open')).toBe(true);
      });
    });

    describe('resetFilters', () => {
      it('removes all current filters from route', () => {
        const userParams = {
          reusability: 'open',
          qf: [
            'collection:newspaper',
            'COUNTRY:"Netherlands"',
            'proxy_dcterms_issued:1871-12-12'
          ],
          sort: 'proxy_dcterms_issued+asc'
        };
        const wrapper = factory({ searchStoreState: { userParams } });
        sinon.spy(wrapper.vm, 'rerouteSearch');

        wrapper.vm.resetFilters();

        expect(wrapper.vm.rerouteSearch.calledWith({ page: 1, qf: null, sort: null, reusability: null })).toBe(true);
      });
    });

    describe('changeFacet', () => {
      const facetName = 'TYPE';

      describe('when facet had selected values', () => {
        const initialSelectedValues = ['"IMAGE"'];
        const propsData = {
          userParams: {
            qf: ['TYPE:"IMAGE"']
          }
        };

        describe('and they changed', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ propsData });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ propsData });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });

      describe('when facet had no selected values', () => {
        const propsData = {
          userParams: {
            qf: []
          }
        };

        describe('and some were selected', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ propsData });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(true);
          });
        });

        describe('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ propsData });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            expect(searchRerouter.called).toBe(false);
          });
        });
      });
    });

    describe('queryUpdatesForFacetChanges', () => {
      describe('when facet is REUSABILITY', () => {
        describe('with values selected', () => {
          const selected = { 'REUSABILITY': ['open', 'permission'] };
          it('sets `reusability` to values joined with ","', () => {
            const wrapper = factory();

            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.reusability).toBe('open,permission');
          });
        });

        describe('with no values selected', () => {
          it('sets `reusability` to `null`', () => {
            const wrapper = factory();

            const updates = wrapper.vm.queryUpdatesForFacetChanges();

            expect(updates).toEqual({ qf: [], sort: [], page: 1 });
          });
        });
      });

      describe('for default facets from search plugin supporting quotes', () => {
        it('includes fielded and quoted queries for each value in `qf`', () => {
          const wrapper = factory();
          const selected = { 'TYPE': ['"IMAGE"', '"SOUND"'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('TYPE:"IMAGE"');
          expect(updates.qf).toContain('TYPE:"SOUND"');
        });
      });

      describe('for default facets from search plugin not supporting quotes', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const wrapper = factory();
          const selected = { 'MIME_TYPE': ['application/pdf'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('MIME_TYPE:application/pdf');
        });
      });

      describe('for any other facets', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const wrapper = factory();
          const selected = { 'contentTier': ['4'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('contentTier:4');
        });
      });

      describe('in a collection having custom filters', () => {
        const propsData = {
          userParams: {
            qf: ['proxy_dcterms_issued:1900-01-01']
          },
          collection: 'newspaper'
        };

        it('applies them', () => {
          const wrapper = factory({ propsData });
          const selected = { 'proxy_dcterms_issued': ['1900-01-02'] };

          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

          expect(updates.qf).toContain('proxy_dcterms_issued:1900-01-02');
        });

        describe('when collection is changed', () => {
          const wrapper = factory({ propsData });
          const selected = { collection: 'art' };

          it('removes collection-specific facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('proxy_dcterms_issued:1900-01-01');
          });
        });

        describe('when collection is removed', () => {
          const wrapper = factory({ propsData });
          const selected = { collection: null };

          it('removes collection-specific facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('proxy_dcterms_issued:1900-01-01');
          });
        });
      });

      describe('with collection-specific facets already selected', () => {
        const propsData = {
          userParams: {
            qf: [
              'CREATOR:"Missoni (Designer)"',
              'TYPE:"IMAGE"',
              'contentTier:"3"'
            ]
          },
          collection: 'fashion'
        };

        describe('when collection is changed', () => {
          const wrapper = factory({ propsData });
          const selected = { collection: 'art' };

          it('removes collection-specific facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).not.toContain('CREATOR:"Missoni (Designer)"');
          });

          it('preserves generic facet filters', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).toContain('TYPE:"IMAGE"');
          });

          it('keeps the tier filter', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);

            expect(updates.qf).toContain('contentTier:"3"');
          });
        });

        describe('when collection is removed', () => {
          const wrapper = factory({ propsData });
          const selected = { collection: [] };

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

            expect(updates.qf).not.toContain('contentTier:"3"');
          });
        });
      });
    });

    describe('changeSort', () => {
      const initialSortValue = ['proxy_dcterms_issued%2Bdesc'];
      const propsData = {
        userParams: {
          qf: ['collection%3Anewspaper', 'TYPE:"TEXT"'],
          sort: initialSortValue
        }
      };

      describe('when changing the sort direction', () => {
        const newSortValue = ['proxy_dcterms_issued%2Basc'];

        it('updates the sortValue and triggers rerouting', async() => {
          const wrapper = factory({ propsData });
          const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

          await wrapper.vm.changeSort('sort', newSortValue);
          expect(wrapper.vm.$data.sortValue).toBe(newSortValue);
          expect(searchRerouter.called).toBe(true);
        });
      });

      describe('when called with unchanged values', () => {
        it('does not trigger rerouting', async() => {
          const wrapper = factory({ propsData });
          const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

          await wrapper.vm.changeSort('sort', initialSortValue);
          expect(searchRerouter.called).toBe(false);
        });
      });
    });
  });
});
