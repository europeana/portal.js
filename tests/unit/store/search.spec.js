import store from '@/store/search';
import sinon from 'sinon';

describe('store/search', () => {
  beforeAll(() => {
    store.actions.$i18n = { locale: 'es' };
  });
  beforeEach(sinon.resetHistory);

  describe('getters', () => {
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
        const dispatch = sinon.stub().resolves();

        await store.actions.run({ dispatch, getters: {} });

        expect(dispatch.calledWith('deriveApiSettings')).toBe(true);
      });

      it('queries for items', async() => {
        const dispatch = sinon.stub().resolves();

        await store.actions.run({ dispatch });

        expect(dispatch.calledWith('queryItems')).toBe(true);
      });
    });

    describe('queryItems', () => {
      const dispatch = sinon.stub().resolves();
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
      const dispatch = sinon.stub().resolves();
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
