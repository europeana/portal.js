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
        const searchQuery = 'anything';

        baseRequest
          .query(query => {
            return query.query === searchQuery;
          })
          .reply(200, defaultResponse);

        const commit = sinon.spy();
        const dispatch = sinon.spy();
        const params = {
          query: searchQuery
        };
        await store.actions.run({ commit, dispatch }, params);

        nock.isDone().should.be.true;
      });

      it('includes "hidden" `qf` params in API request');

      it('writes params to the store');

      context('on success', () => {
        it('dispatches updateForSuccess');
      });

      context('on failure', () => {
        it('dispatches updateForFailure');
      });
    });
  });
});
