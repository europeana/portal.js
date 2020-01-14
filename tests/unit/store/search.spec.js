// TODO: move stubbed into own module? (duplicates code in plugins/europeana/search.spec.js)

import * as store from '../../../store/search';
import apiConfig from '../../../plugins/europeana/api';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';
const apiKey = '1234';
apiConfig.record.key = apiKey;
apiConfig.newspaper.key = apiKey;

const baseRequest = nock(apiUrl).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('store/search', () => {
  describe('actions', () => {
    describe('run', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('derives the API params', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        // const searchQuery = 'anything';
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

    describe('deriveApiSettings', () => {
      it('combines userParams and overrideParams into apiParams', async() => {
        const userQuery = 'calais';
        const userQf = 'TYPE:"IMAGE"';
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';
        const overrideTheme = 'migration';

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
          theme: overrideTheme
        });
      });

      context('when searching the Newspapers collection', () => {
        it('dispatches deriveApiSettingsForNewspaperTheme action', async() => {
          const commit = sinon.spy();
          const dispatch = sinon.spy();
          const state = {
            userParams: {
              theme: 'newspaper'
            }
          };

          await store.actions.deriveApiSettings({ commit, dispatch, state });

          dispatch.should.have.been.calledWith('deriveApiSettingsForNewspaperTheme');
        });
      });

      describe('deriveApiSettingsForNewspaperTheme', () => {
        context('when `api` param is "fulltext"', () => {
          it('overrides contentTier qf to *', async() => {
            const commit = sinon.spy();
            const dispatch = sinon.spy();
            const state = {
              apiParams: {
                api: 'fulltext',
                qf: ['contentTier:(2 OR 3 OR 4)']
              },
              apiOptions: {}
            };

            await store.actions.deriveApiSettingsForNewspaperTheme({ commit, dispatch, state });

            commit.should.have.been.calledWith('setApiParams', {
              api: 'fulltext',
              qf: ['contentTier:*'],
              wskey: apiKey
            });
          });

          it('sets origin option to the Newspapers API', async() => {
            const commit = sinon.spy();
            const dispatch = sinon.spy();
            const state = {
              apiParams: {
                api: 'fulltext'
              },
              apiOptions: {}
            };

            await store.actions.deriveApiSettingsForNewspaperTheme({ commit, dispatch, state });

            commit.should.have.been.calledWith('setApiOptions', {
              origin: 'https://newspapers.eanadev.org'
            });
          });
        });
      });
    });
  });
});
