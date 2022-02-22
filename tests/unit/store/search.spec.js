import store from '@/store/search';
import sinon from 'sinon';

describe('store/search', () => {
  beforeAll(() => {
    store.actions.$i18n = { locale: 'es' };
  });
  beforeEach(sinon.resetHistory);

  describe('getters', () => {
    describe('filters()', () => {
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

      it('queries for items if needed', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { itemUpdateNeeded: true, facetUpdateNeeded: true } });

        expect(dispatch.calledWith('queryItems')).toBe(true);
      });

      it('omits query for items if not needed', async() => {
        const dispatch = sinon.spy();

        await store.actions.run({ dispatch, getters: { itemUpdateNeeded: false, facetUpdateNeeded: true } });

        expect(dispatch.calledWith('queryItems')).toBe(false);
      });
    });

    describe('queryItems', () => {
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

    describe('deriveApiSettings', () => {
      const commit = sinon.spy();
      const dispatch = sinon.spy();
      const state = {};
      const getters = sinon.spy();
      const rootGetters = sinon.spy();

      it('combines userParams and overrideParams into apiParams', () => {
        const userQuery = 'calais';
        const userQf = 'TYPE:"IMAGE"';
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';
        const profile = 'minimal';

        const state = {
          userParams: {
            query: userQuery,
            qf: userQf
          },
          overrideParams: {
            qf: [overrideQf]
          }
        };

        store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

        expect(commit.calledWith('set', [
          'apiParams',
          {
            query: userQuery,
            qf: [userQf, overrideQf],
            profile
          }
        ])).toBe(true);
      });

      describe('within a theme having fulltext API support', () => {
        const getters = { theme: { filters: { api: {} } } };

        describe('metadata/fulltext API selection', () => {
          it('applies user selection if present', () => {
            const state = { userParams: { api: 'metadata' } };
            const getters = { theme: { filters: { api: { default: 'fulltext' } } } };

            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiParams', sinon.match.has('api', 'metadata')])
            ).toBe(true);
          });

          it('falls back to theme-specific default if set', () => {
            const getters = { theme: { filters: { api: { default: 'metadata' } } } };

            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiParams', sinon.match.has('api', 'metadata')])
            ).toBe(true);
          });

          it('falls back to fulltext if no theme-specific default', () => {
            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiParams', sinon.match.has('api', 'fulltext')])
            ).toBe(true);
          });
        });

        describe('and fulltext API is selected', () => {
          const state = { userParams: { api: 'fulltext' } };

          it('sets profile param to "minimal,hits"', () => {
            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiParams', sinon.match.has('profile', 'minimal,hits')])
            ).toBe(true);
          });

          it('sets fulltext API URL option', () => {
            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiOptions', sinon.match.has('url', 'https://newspapers.eanadev.org/api/v2')])
            ).toBe(true);
          });
        });

        describe('and metadata API is selected', () => {
          const state = { userParams: { api: 'metadata' } };

          it('does not set profile param to "minimal,hits"', () => {
            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiParams', sinon.match.has('profile', 'minimal,hits')])
            ).toBe(false);
          });

          it('does not set fulltext API URL option', () => {
            store.actions.deriveApiSettings({ commit, dispatch, state, getters, rootGetters });

            expect(
              commit.calledWith('set', ['apiOptions', sinon.match.has('url', 'https://newspapers.eanadev.org/api/v2')])
            ).toBe(false);
          });
        });
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
        const state = { liveQueries: [{ qf: ['TYPE:"IMAGE"'] }] };
        const query = { qf: ['collection:"migration"'] };

        store.mutations.addLiveQuery(state, query);

        expect(state.liveQueries.length).toBe(2);
        expect(state.liveQueries).toContain(query);
      });

      describe('removeLiveQuery', () => {
        it('removes the passed query from the store', () => {
          const query = { qf: ['collection:"migration"'] };
          const state = { liveQueries: [{ qf: ['TYPE:"IMAGE"'] }, query] };

          store.mutations.removeLiveQuery(state, query);

          expect(state.liveQueries.length).toBe(1);
          expect(state.liveQueries).not.toContain(query);
        });
      });
    });
  });
});
