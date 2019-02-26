// TODO: consider using chai-nock

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

import nock from 'nock';
import search from '../../../../plugins/europeana/search';

const apiKey = 'abcdef';

describe('plugins/europeana/search', () => {
  describe('when API responds with error', () => {
    const json = require('../../../fixtures/europeana/search/error.json');

    before('stub API response', () => {
      nock('https://api.europeana.eu')
        .get('/api/v2/search.json')
        .query(true)
        .reply(400, json);
    });

    it('returns API error message', () => {
      const response = search({ query: 'NOT ', wskey: apiKey });
      return expect(response).to.eventually.have.property('error', json.error);
    });
  });

  describe('when query is blank', () => {
    const json = require('../../../fixtures/europeana/search/no-results.json');

    before('stub API response', () => {
      nock('https://api.europeana.eu')
        .get('/api/v2/search.json')
        .query(query => {
          if (query['query'] === '*:*') {
            return true;
          }
        })
        .reply(200, json);
    });

    it('maps the query to *:*', () => {
      const response = search({ query: '', wskey: apiKey });
      return expect(response).to.eventually.have.property('error', null);
    });
  });
});
