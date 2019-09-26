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
  describe('actions', () => {
    describe('run', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('searches the Record API', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const searchQuery = 'anything';

        baseRequest
          .query(query => {
            return query.query === searchQuery;
          })
          .reply(200, defaultResponse);

        const params = {
          query: searchQuery
        };
        await store.actions.run({ commit, dispatch }, params);

        nock.isDone().should.be.true;
      });

      it('includes "hidden" `qf` params in API request', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const unhiddenQf = 'TYPE:"IMAGE"';
        const hiddenQf = 'edm_agent:"http://data.europeana.eu/agent/base/200"';

        baseRequest
          .query(query => {
            return query.qf.includes(unhiddenQf) && query.qf.includes(hiddenQf);
          })
          .reply(200, defaultResponse);

        const params = {
          qf: [unhiddenQf],
          hidden: {
            qf: [hiddenQf]
          }
        };
        await store.actions.run({ commit, dispatch }, params);

        nock.isDone().should.be.true;
      });

      it('commits params to the store', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();
        baseRequest
          .query(true)
          .reply(200, defaultResponse);

        const params = {
          page: 10,
          qf: ['TYPE:"VIDEO"'],
          query: 'migration',
          reusability: 'open'
        };
        const selectedFacets = { 'REUSABILITY': ['open'], 'TYPE': ['VIDEO'] };

        await store.actions.run({ commit, dispatch }, params);

        commit.should.have.been.calledWith('setPage', params.page);
        commit.should.have.been.calledWith('setQf', params.qf);
        commit.should.have.been.calledWith('setQuery', params.query);
        commit.should.have.been.calledWith('setReusability', params.reusability);
        commit.should.have.been.calledWith('setSelectedFacets', selectedFacets);
      });

      context('on success', () => {
        it('dispatches updateForSuccess', async() => {
          const commit = sinon.spy();
          const dispatch = sinon.spy();
          baseRequest
            .query(true)
            .reply(200, defaultResponse);

          await store.actions.run({ commit, dispatch }, {});

          dispatch.should.have.been.calledWith('updateForSuccess');
        });
      });

      context('on failure', () => {
        it('dispatches updateForFailure', async() => {
          const commit = sinon.spy();
          const dispatch = sinon.spy();
          const errorMessage = 'Invalid query parameter.';
          baseRequest
            .query(true)
            .reply(400, {
              success: false,
              error: errorMessage
            });

          await store.actions.run({ commit, dispatch }, {});

          dispatch.should.have.been.calledWith('updateForFailure');
        });
      });
    });
  });
});
