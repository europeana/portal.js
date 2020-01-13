// TODO: move stubbed into own module? (duplicates code in plugins/europeana/search.spec.js)

import * as store from '../../../store/search';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';

const baseRequest = nock(apiUrl).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('store/search', () => {
  describe('mutations', () => {
    describe('deriveApiSettings', () => {
      it('combines userParams and overrideParams into apiParams', () => {
        const userQuery = 'calais';
        const userQf = 'TYPE:"IMAGE"';
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';
        const overrideTheme = 'migration';

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

        store.mutations.deriveApiSettings(state);

        state.apiParams.should.deep.eql({
          query: userQuery,
          qf: [userQf, overrideQf],
          theme: overrideTheme
        });
      });

      context('when searching the Newspapers collection', () => {
        context('when `api` param is "fulltext"', () => {
          it('overrides contentTier qf to *', () => {
            const state = {
              userParams: {
                api: 'fulltext',
                theme: 'newspaper'
              },
              overrideParams: {
                qf: ['contentTier:(2 OR 3 OR 4)']
              }
            };

            store.mutations.deriveApiSettings(state);

            state.apiParams.qf.should.include('contentTier:*');
            state.apiParams.qf.should.not.include('contentTier:(2 OR 3 OR 4)');
          });

          it('sets origin option to the Newspapers API', async() => {
            const state = {
              userParams: {
                api: 'fulltext',
                theme: 'newspaper'
              }
            };

            store.mutations.deriveApiSettings(state);

            state.apiOptions.origin.should.eql('https://newspapers.eanadev.org');
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
        // const searchQuery = 'anything';
        const state = {};

        baseRequest
          .query(true)
          .reply(200, defaultResponse);

        await store.actions.run({ commit, dispatch, state });

        commit.should.have.been.calledWith('deriveApiSettings');

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
  });
});
