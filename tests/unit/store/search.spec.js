import * as store from '../../../store/search';
import apiConfig from '../../../plugins/europeana/api';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';
const apiKey = '1234';

const baseRequest = nock(apiUrl).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('store/search', () => {
  beforeEach(() => {
    apiConfig.record.key = apiKey;
    apiConfig.newspaper.key = apiKey;
  });

  describe('getters', () => {
    describe('hasCollectionSpecificSettings', () => {
      context('when theme param is absent', () => {
        const theme = undefined;

        it('is false', () => {
          store.getters.hasCollectionSpecificSettings({})(theme).should.be.false;
        });
      });

      context('when theme param is present', () => {
        const theme = 'music';

        context('when rootState has collection store for the theme', () => {
          context('with `enabled` property', () => {
            context('that is enabled', () => {
              const rootState = { collections: { [theme]: { enabled: true } } };
              it('is true', () => {
                store.getters.hasCollectionSpecificSettings({}, {}, rootState)(theme).should.be.true;
              });
            });

            context('that is disabled', () => {
              const rootState = { collections: { [theme]: { enabled: false } } };
              it('is false', () => {
                store.getters.hasCollectionSpecificSettings({}, {}, rootState)(theme).should.be.false;
              });
            });
          });

          context('without `enabled` property', () => {
            const rootState = { collections: { [theme]: {} } };
            it('is true', () => {
              store.getters.hasCollectionSpecificSettings({}, {}, rootState)(theme).should.be.true;
            });
          });
        });

        context('when rootState lacks collection store for the theme', () => {
          const rootState = { collections: {} };
          it('is false', () => {
            store.getters.hasCollectionSpecificSettings({}, {}, rootState)(theme).should.be.false;
          });
        });
      });
    });
  });

  describe('actions', () => {
    describe('run', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('derives the API params', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const state = {};

        baseRequest
          .query(true)
          .reply(200, defaultResponse);

        await store.actions.run({ commit, dispatch, state });

        dispatch.should.have.been.calledWith('deriveApiSettings');
      });

      it('searches the Record API', async() => {
        const searchQuery = 'anything';
        const qf = 'TYPE:"IMAGE"';
        const theme = 'migration';
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const state = { apiParams: { query: searchQuery, qf: [qf], theme } };

        baseRequest
          .query(query => {
            return query.query === searchQuery && query.qf.includes(qf) && query.theme === theme;
          })
          .reply(200, defaultResponse);

        await store.actions.run({ commit, dispatch, state });

        nock.isDone().should.be.true;
      });

      context('on success', () => {
        it('dispatches updateForSuccess', async() => {
          const commit = sinon.spy();
          const dispatch = sinon.spy();
          const state = {};

          baseRequest
            .query(true)
            .reply(200, defaultResponse);

          await store.actions.run({ commit, dispatch, state });

          dispatch.should.have.been.calledWith('updateForSuccess');
        });
      });

      context('on failure', () => {
        it('dispatches updateForFailure', async() => {
          const commit = sinon.spy();
          const dispatch = sinon.spy();
          const state = {};
          const errorMessage = 'Invalid query parameter.';

          baseRequest
            .query(true)
            .reply(400, {
              success: false,
              error: errorMessage
            });

          await store.actions.run({ commit, dispatch, state });

          dispatch.should.have.been.calledWith('updateForFailure');
        });
      });
    });

    describe('applyCollectionSpecificSettings', () => {
      it('TODO');
    });

    describe('deriveApiSettings', () => {
      it('combines userParams and overrideParams into apiParams', async() => {
        const userQuery = 'calais';
        const userQf = 'TYPE:"IMAGE"';
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';
        const overrideTheme = 'migration';
        const profile = 'minimal,facets';
        const facet = store.defaultFacetNames.join(',');

        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const state = {
          userParams: {
            query: userQuery,
            qf: userQf
          },
          overrideParams: {
            qf: [overrideQf],
            theme: overrideTheme
          }
        };

        await store.actions.deriveApiSettings({ commit, dispatch, state });

        commit.should.have.been.calledWith('setApiParams', {
          query: userQuery,
          qf: [userQf, overrideQf],
          theme: overrideTheme,
          profile,
          facet
        });
      });
    });
  });
});
