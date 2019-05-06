import nock from 'nock';
import getEntity, { relatedEntities } from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiUrl = 'https://www.europeana.eu';
const apiEndpoint = '/api/entities/concept/base/94';
const apiKey = 'abcdef';
const baseRequest = nock(apiUrl).get(apiEndpoint);

const apiUrlSearch = 'https://api.europeana.eu';
const apiEndpointSearch = '/api/v2/search.json';

const searchResponse = {
  facets: [
    { name: 'edm_agent', fields: [
      { label: 'http://data.europeana.eu/agent/base/147831' },
      { label: 'http://data.europeana.eu/agent/base/49928' }
    ] }
  ]
};

const entitiesResponse = {
  items: [
    { type: 'Agent', id: 'http://data.europeana.eu/agent/base/147831', prefLabel: { en: 'Architecture' } },
    { type: 'Agent', id: 'http://data.europeana.eu/agent/base/49928', prefLabel: { en: 'Painting' } }
  ]
};

describe('plugins/europeana/entity', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getEntity()', () => {
    describe('API response', () => {
      describe('with "No resource found with ID: ..." error', () => {
        const errorMessage = 'No resource found with ID:';

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(404, {
              error: errorMessage
            });
        });

        it('throws API error message', () => {
          const response = getEntity(entityType, entityId, { wskey: apiKey });
          return response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with object in response', () => {
        const apiResponse = {
          prefLabel: {
            en: 'Architecture'
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async () => {
          const response = await getEntity(entityType, entityId, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('has a misspelled id and returns entity title', async () => {
          const response = await getEntity(entityType, entityIdMisspelled, { wskey: apiKey });
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
    });
  });

  describe('relatedEntities()', () => {
    describe('API response', () => {
      describe('with object in response', () => {

        beforeEach('stub API response', () => {
          nock(apiUrlSearch)
            .get(apiEndpointSearch)
            .query(true)
            .reply(200, searchResponse);

          nock(apiUrl)
            .get('/api/entities/search')
            .query(true)
            .reply(200, entitiesResponse);
        });

        it('returns related entities', async () => {
          const response = await relatedEntities(entityType, entityId, { wskey: apiKey });
          response.length.should.eq(entitiesResponse.items.length);
        });
      });
    });
  });

});
