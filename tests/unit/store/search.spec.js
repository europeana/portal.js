import store, { defaultFacetNames } from '@/store/search';
import sinon from 'sinon';

describe('store/search', () => {
  beforeAll(() => {
    store.actions.$i18n = { locale: 'es' };
  });

  describe('getters', () => {
    describe('filters()', () => {
      describe('when collection param is absent', () => {
        const collection = undefined;

        it('is false', () => {
          expect(store.getters.hasCollectionSpecificSettings({})(collection)).toBe(false);
        });
      });

      describe('with `null` query qf', () => {
        it('returns {}', async() => {
          const state = {
            apiParams: {},
            userParams: {
              qf: null
            }
          };

          expect(store.getters.filters(state)).toEqual({});
        });
      });

      describe('with single query qf value', () => {
        it('returns it in an array on a property named for the facet', async() => {
          const state = {
            apiParams: {},
            userParams: {
              qf: 'TYPE:"IMAGE"'
            }
          };

          expect(store.getters.filters(state)).toEqual({ 'TYPE': ['"IMAGE"'] });
        });
      });

      describe('with multiple query qf values', () => {
        it('returns them in arrays on properties named for each facet', async() => {
          const query = { qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:open'] };
          const expected = { 'TYPE': ['"IMAGE"', '"VIDEO"'], 'REUSABILITY': ['open'] };

          const state = {
            apiParams: {},
            userParams: query
          };

          expect(store.getters.filters(state)).toEqual(expected);
        });
      });

      describe('with reusability values', () => {
        it('returns them in an array on REUSABILITY property', async() => {
          const query = { reusability: 'open,restricted' };
          const expected = { 'REUSABILITY': ['open', 'restricted'] };

          const state = {
            apiParams: {},
            userParams: query
          };

          expect(store.getters.filters(state)).toEqual(expected);
        });
      });

      describe('with api value', () => {
        it('returns it as a string on api property', async() => {
          const query = { api: 'metadata' };
          const expected = { 'api': 'metadata' };

          const state = {
            apiParams: query,
            userParams: {}
          };

          expect(store.getters.filters(state)).toEqual(expected);
        });
      });

      describe('with query that has two colons', () => {
        it('returns an array with a string seperated by a colon', async() => {
          const query = { qf: 'DATA_PROVIDER:"Galiciana: Biblioteca Digital de Galicia"' };
          const expected = { 'DATA_PROVIDER': ['"Galiciana: Biblioteca Digital de Galicia"'] };

          const state = {
            apiParams: {},
            userParams: query
          };

          expect(store.getters.filters(state)).toEqual(expected);
        });
      });
    });

    describe('queryUpdatesForFacetChanges', () => {
      const state = {
        resettableFilters: []
      };
      const getters = {};

      describe('when facet is REUSABILITY', () => {
        describe('with values selected', () => {
          const selected = { 'REUSABILITY': ['open', 'permission'] };
          it('sets `reusability` to values joined with ","', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);
            expect(updates.reusability).toBe('open,permission');
          });
        });

        describe('with no values selected', () => {
          it('sets `reusability` to `null`', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)();
            expect(updates).toEqual({ qf: [], page: 1 });
          });
        });
      });

      describe('for default facets from search plugin supporting quotes', () => {
        it('includes fielded and quoted queries for each value in `qf`', () => {
          const selected = { 'TYPE': ['"IMAGE"', '"SOUND"'] };
          const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);
          expect(updates.qf).toContain('TYPE:"IMAGE"');
          expect(updates.qf).toContain('TYPE:"SOUND"');
        });
      });

      describe('for default facets from search plugin not supporting quotes', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const selected = { 'MIME_TYPE': ['application/pdf'] };
          const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);
          expect(updates.qf).toContain('MIME_TYPE:application/pdf');
        });
      });

      describe('for any other facets', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const selected = { 'contentTier': ['4'] };
          const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);
          expect(updates.qf).toContain('contentTier:4');
        });
      });

      describe('in a collection having custom filters', () => {
        const state = {
          userParams: {
            qf: ['proxy_dcterms_issued:1900-01-01']
          },
          resettableFilters: ['proxy_dcterms_issued']
        };
        const getters = {
          collection: () => 'newspaper'
        };

        it('applies them', () => {
          const selected = { api: 'metadata', 'proxy_dcterms_issued': ['1900-01-02'] };

          const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

          expect(updates.qf).toContain('proxy_dcterms_issued:1900-01-02');
          expect(updates.api).toBe('metadata');
        });
      });

      describe('with collection-specific facets already selected', () => {
        const state = {
          resettableFilters: ['collection', 'CREATOR', 'TYPE']
        };
        const getters = {
          filters: {
            'CREATOR': ['"Missoni (Designer)"'],
            'TYPE': ['"IMAGE"'],
            'contentTier': ['*']
          },
          collection: 'fashion'
        };

        describe('when collection is changed', () => {
          const selected = { 'collection': 'art' };

          it('removes collection-specific facet filters', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

            expect(updates.qf).not.toContain('CREATOR:"Missoni (Designer)"');
          });

          it('preserves generic facet filters', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

            expect(updates.qf).toContain('TYPE:"IMAGE"');
          });

          it('removes tier filter', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

            expect(updates.qf).not.toContain('contentTier:*');
          });
        });

        describe('when collection is removed', () => {
          const selected = { 'collection': null };

          it('removes collection-specific facet filters', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

            expect(updates.qf).not.toContain('CREATOR:"Missoni (Designer)"');
          });

          it('preserves generic facet filters', () => {
            const updates = store.getters.queryUpdatesForFacetChanges(state, getters)(selected);

            expect(updates.qf).toContain('TYPE:"IMAGE"');
          });
        });
      });
    });

    describe('hasCollectionSpecificSettings', () => {
      describe('when collection param is absent', () => {
        const collection = undefined;

        it('is false', () => {
          expect(store.getters.hasCollectionSpecificSettings({})(collection)).toBe(false);
        });
      });

      describe('when collection param is present', () => {
        const collection = 'music';

        describe('when rootState has collection store for the collection', () => {
          describe('with `enabled` property', () => {
            describe('that is enabled', () => {
              const rootState = { collections: { [collection]: { enabled: true } } };
              it('is true', () => {
                expect(store.getters.hasCollectionSpecificSettings({}, {}, rootState)(collection)).toBe(true);
              });
            });

            describe('that is disabled', () => {
              const rootState = { collections: { [collection]: { enabled: false } } };
              it('is false', () => {
                expect(store.getters.hasCollectionSpecificSettings({}, {}, rootState)(collection)).toBe(false);
              });
            });
          });

          describe('without `enabled` property', () => {
            const rootState = { collections: { [collection]: {} } };
            it('is true', () => {
              expect(store.getters.hasCollectionSpecificSettings({}, {}, rootState)(collection)).toBe(true);
            });
          });
        });

        describe('when rootState lacks collection store for the collection', () => {
          const rootState = { collections: {} };
          it('is false', () => {
            expect(store.getters.hasCollectionSpecificSettings({}, {}, rootState)(collection)).toBe(false);
          });
        });
      });
    });

    describe('apiParamsChanged', () => {
      describe('with params added', () => {
        it('returns their names', () => {
          const state = {
            previousApiParams: {
              query: '*:*'
            },
            apiParams: {
              query: '*:*',
              qf: ['TYPE:"IMAGE"']
            }
          };

          const apiParamsChanged = store.getters.apiParamsChanged(state);

          expect(apiParamsChanged).toEqual(['qf']);
        });
      });

      describe('with params removed', () => {
        it('returns their names', () => {
          const state = {
            previousApiParams: {
              query: '*:*',
              qf: ['TYPE:"IMAGE"']
            },
            apiParams: {
              query: '*:*'
            }
          };

          const apiParamsChanged = store.getters.apiParamsChanged(state);

          expect(apiParamsChanged).toEqual(['qf']);
        });
      });

      describe('without changed params', () => {
        it('returns their names', () => {
          const state = {
            previousApiParams: {
              query: '*:*',
              qf: ['TYPE:"IMAGE"']
            },
            apiParams: {
              query: '*:*',
              qf: ['TYPE:"IMAGE"']
            }
          };

          const apiParamsChanged = store.getters.apiParamsChanged(state);

          expect(apiParamsChanged).toEqual([]);
        });
      });
    });

    describe('itemUpdateNeeded', () => {
      describe('without previous API params', () => {
        const previousApiParams = null;

        it('is `true`', () => {
          const itemUpdateNeeded = store.getters.itemUpdateNeeded(
            { previousApiParams }
          );

          expect(itemUpdateNeeded).toBe(true);
        });
      });

      describe('with previous API params', () => {
        const previousApiParams = {
          query: '*:*'
        };

        for (const param of ['query', 'qf', 'reusability', 'api', 'page']) {
          describe(`when ${param} param changes`, () => {
            it('is `true`', () => {
              const apiParamsChanged = [param];

              const itemUpdateNeeded = store.getters.itemUpdateNeeded(
                { previousApiParams },
                { apiParamsChanged }
              );

              expect(itemUpdateNeeded).toBe(true);
            });
          });
        }

        for (const param of ['view']) {
          describe(`when ${param} param changes`, () => {
            it('is `false`', () => {
              const apiParamsChanged = [param];

              const itemUpdateNeeded = store.getters.itemUpdateNeeded(
                { previousApiParams },
                { apiParamsChanged }
              );

              expect(itemUpdateNeeded).toBe(false);
            });
          });
        }
      });
    });

    describe('facetUpdateNeeded', () => {
      describe('without previous API params', () => {
        const previousApiParams = null;

        it('is `true`', () => {
          const facetUpdateNeeded = store.getters.facetUpdateNeeded(
            { previousApiParams }
          );

          expect(facetUpdateNeeded).toBe(true);
        });
      });

      describe('with previous API params', () => {
        const previousApiParams = {
          query: '*:*'
        };

        for (const param of ['query', 'qf', 'reusability', 'api']) {
          describe(`when ${param} param changes`, () => {
            it('is `true`', () => {
              const apiParamsChanged = [param];

              const facetUpdateNeeded = store.getters.facetUpdateNeeded(
                { previousApiParams },
                { apiParamsChanged }
              );

              expect(facetUpdateNeeded).toBe(true);
            });
          });
        }

        for (const param of ['page', 'view']) {
          describe(`when ${param} param changes`, () => {
            it('is `false`', () => {
              const apiParamsChanged = [param];

              const facetUpdateNeeded = store.getters.facetUpdateNeeded(
                { previousApiParams },
                { apiParamsChanged }
              );

              expect(facetUpdateNeeded).toBe(false);
            });
          });
        }
      });
    });

    describe('searchOptions', () => {
      describe('.escape', () => {
        it('is `true` when override params has query and user params does not', () => {
          const state = {
            overrideParams: { query: 'crumpet' },
            userParams: {}
          };

          const escape = store.getters.searchOptions(state).escape;

          expect(escape).toBe(true);
        });

        it('is `true` when override params has query and user params query is blank', () => {
          const state = {
            overrideParams: { query: 'crumpet' },
            userParams: { query: '' }
          };

          const escape = store.getters.searchOptions(state).escape;

          expect(escape).toBe(true);
        });

        it('is `false` when override params has no query', () => {
          const state = {
            overrideParams: {},
            userParams: {}
          };

          const escape = store.getters.searchOptions(state).escape;

          expect(escape).toBe(false);
        });
      });
    });
  });

  describe('actions', () => {
    describe('run', () => {
      it('derives the API params', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: {} });

        expect(dispatch.calledWith('deriveApiSettings')).toBe(true);
      });

      it('queries for items and facets if needed', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { itemUpdateNeeded: true, facetUpdateNeeded: true } });

        expect(dispatch.calledWith('queryItems')).toBe(true);
        expect(dispatch.calledWith('queryFacets')).toBe(true);
      });

      it('omits query for items if not needed', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { itemUpdateNeeded: false, facetUpdateNeeded: true } });

        expect(dispatch.calledWith('queryItems')).toBe(false);
        expect(dispatch.calledWith('queryFacets')).toBe(true);
      });

      it('omits query for facets if not needed', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { itemUpdateNeeded: true, facetUpdateNeeded: false } });

        expect(dispatch.calledWith('queryItems')).toBe(true);
        expect(dispatch.calledWith('queryFacets')).toBe(false);
      });

      it('omits query for facets if explicitly skipped', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { facetUpdateNeeded: true } }, { skipFacets: true });

        expect(dispatch.calledWith('queryFacets')).toBe(false);
      });
    });

    describe('queryItems', () => {
      beforeEach(() => {
        sinon.resetHistory();
      });

      const dispatch = sinon.spy();
      const commit = sinon.spy();
      const getters = {};
      const searchQuery = 'anything';
      const typeQf = 'TYPE:"IMAGE"';
      const collectionQf = 'collection:"migration"';
      const state = { apiParams: { query: searchQuery, qf: [typeQf, collectionQf] } };
      const queryParams = state.apiParams;

      it('searches the Record API', async() => {
        store.actions.$apis = {
          record: {
            search: sinon.stub().resolves({})
          }
        };

        await store.actions.queryItems({ dispatch, state, getters, commit });

        expect(store.actions.$apis.record.search.called).toBe(true);
      });

      describe('on success', () => {
        beforeAll(() => {
          store.actions.$apis = {
            record: {
              search: sinon.stub().resolves({})
            }
          };
        });

        it('dispatches updateForSuccess', async() => {
          await store.actions.queryItems({ dispatch, state, getters, commit });

          expect(dispatch.calledWith('updateForSuccess')).toBe(true);
        });

        it('logs the query while live', async() => {
          await store.actions.queryItems({ dispatch, state, getters, commit });

          expect(commit.calledWith('addLiveQuery', queryParams)).toBe(true);
          expect(commit.calledWith('removeLiveQuery', queryParams)).toBe(true);
        });
      });

      describe('on failure', () => {
        beforeAll(() => {
          store.actions.$apis = {
            record: {
              search: sinon.stub().rejects({})
            }
          };
        });

        it('dispatches updateForFailure', async() => {
          await store.actions.queryItems({ dispatch, state, getters, commit });

          expect(dispatch.calledWith('updateForFailure')).toBe(true);
        });

        it('logs the query while live', async() => {
          await store.actions.queryItems({ dispatch, state, getters, commit });

          expect(commit.calledWith('addLiveQuery', queryParams)).toBe(true);
          expect(commit.calledWith('removeLiveQuery', queryParams)).toBe(true);
        });
      });
    });

    describe('queryFacets', () => {
      beforeEach(() => {
        sinon.resetHistory();
      });

      const dispatch = sinon.spy();
      const commit = sinon.spy();
      const getters = {};
      const searchQuery = 'anything';
      const typeQf = 'TYPE:"IMAGE"';
      const collectionQf = 'collection:"migration"';
      const state = { apiParams: { query: searchQuery, qf: [typeQf, collectionQf] } };
      const queryParams = { ...state.apiParams, rows: 0, profile: 'facets' };

      it('searches the Record API', async() => {
        store.actions.$apis = {
          record: {
            search: sinon.stub().resolves({})
          }
        };

        await store.actions.queryFacets({ dispatch, state, getters, commit });

        expect(store.actions.$apis.record.search.called).toBe(true);
      });

      describe('on success', () => {
        beforeAll(() => {
          store.actions.$apis = {
            record: {
              search: sinon.stub().resolves({ facets: [1, 2] })
            }
          };
        });

        it('commits facets', async() => {
          await store.actions.queryFacets({ dispatch, state, getters, commit });

          expect(commit.calledWith('setFacets', [1, 2])).toBe(true);
        });

        it('logs the query while live', async() => {
          await store.actions.queryFacets({ dispatch, state, getters, commit });

          expect(commit.calledWith('addLiveQuery', queryParams)).toBe(true);
          expect(commit.calledWith('removeLiveQuery', queryParams)).toBe(true);
        });
      });

      describe('on failure', () => {
        beforeAll(() => {
          store.actions.$apis = {
            record: {
              search: sinon.stub().rejects({})
            }
          };
        });

        it('dispatches updateForFailure', async() => {
          await store.actions.queryFacets({ dispatch, state, getters, commit });

          expect(dispatch.calledWith('updateForFailure')).toBe(true);
        });

        it('logs the query while live', async() => {
          await store.actions.queryFacets({ dispatch, state, getters, commit });

          expect(commit.calledWith('addLiveQuery', queryParams)).toBe(true);
          expect(commit.calledWith('removeLiveQuery', queryParams)).toBe(true);
        });
      });
    });

    describe('deriveApiSettings', () => {
      it('combines userParams and overrideParams into apiParams', async() => {
        const userQuery = 'calais';
        const userQf = 'TYPE:"IMAGE"';
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';
        const profile = 'minimal';
        const facet = defaultFacetNames.join(',');

        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const getters = sinon.spy();
        const rootGetters = sinon.spy();
        const state = {
          userParams: {
            query: userQuery,
            qf: userQf
          },
          overrideParams: {
            qf: [overrideQf]
          }
        };

        await store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

        expect(commit.calledWith('set', [
          'apiParams',
          {
            query: userQuery,
            qf: [userQf, overrideQf],
            profile,
            facet
          }
        ])).toBe(true);
      });
    });

    describe('setResettableFilter', () => {
      it('commits removeResettableFilter for empty arrays', async() => {
        const name = 'TYPE';
        const selected = [];
        const commit = sinon.spy();

        await store.actions.setResettableFilter({ commit }, { name, selected });

        expect(commit.calledWith('removeResettableFilter', name)).toBe(true);
      });

      it('commits removeResettableFilter for falsy values', async() => {
        const name = 'proxy_dcterms_issued';
        const selected = false;
        const commit = sinon.spy();

        await store.actions.setResettableFilter({ commit }, { name, selected });

        expect(commit.calledWith('removeResettableFilter', name)).toBe(true);
      });

      it('commits addResettableFilter for non-empty arrays', async() => {
        const name = 'TYPE';
        const selected = ['IMAGE'];
        const commit = sinon.spy();

        await store.actions.setResettableFilter({ commit }, { name, selected });

        expect(commit.calledWith('addResettableFilter', name)).toBe(true);
      });

      it('commits addResettableFilter for truthy values', async() => {
        const name = 'proxy_dcterms_issued';
        const selected = true;
        const commit = sinon.spy();

        await store.actions.setResettableFilter({ commit }, { name, selected });

        expect(commit.calledWith('addResettableFilter', name)).toBe(true);
      });
    });
  });

  describe('mutations', () => {
    describe('addLiveQuery', () => {
      it('adds the passed query to the store', () => {
        const state = { liveQueries: [ { qf: ['TYPE:"IMAGE"'] }] };
        const query = { qf: ['collection:"migration"'] };

        store.mutations.addLiveQuery(state, query);

        expect(state.liveQueries.length).toBe(2);
        expect(state.liveQueries).toContain(query);
      });

      describe('removeLiveQuery', () => {
        it('removes the passed query from the store', () => {
          const query = { qf: ['collection:"migration"'] };
          const state = { liveQueries: [ { qf: ['TYPE:"IMAGE"'] }, query] };

          store.mutations.removeLiveQuery(state, query);

          expect(state.liveQueries.length).toBe(1);
          expect(state.liveQueries).not.toContain(query);
        });
      });
    });

    describe('setFacets()', () => {
      it('enquotes values for quotable facets', () => {
        const state = { facets: [] };
        const unquotedFacets = [
          {
            name: 'TYPE',
            fields: [
              { label: 'IMAGE' }
            ]
          }
        ];
        const quotedFacets = [
          {
            name: 'TYPE',
            fields: [
              { label: '"IMAGE"' }
            ]
          }
        ];

        store.mutations.setFacets(state, unquotedFacets);
        expect(state.facets).toEqual(quotedFacets);
      });

      it('escapes Lucene special characters', () => {
        const state = { facets: [] };
        const unescapedFacets = [
          {
            name: 'DATA_PROVIDER',
            fields: [
              { label: 'Nederlands Bakkerijmuseum "Het Warme Land"' }
            ]
          }
        ];
        const escapedFacets = [
          {
            name: 'DATA_PROVIDER',
            fields: [
              { label: '"Nederlands Bakkerijmuseum \\"Het Warme Land\\""' }
            ]
          }
        ];

        store.mutations.setFacets(state, unescapedFacets);
        expect(state.facets).toEqual(escapedFacets);
      });
    });
  });
});
