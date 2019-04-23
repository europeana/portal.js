import nock from 'nock';
import getEntity from '../../../../plugins/europeana/entity';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const entityId = '94-architecture';
const entityType = 'topics';
const apiUrl = 'https://www.europeana.eu';
const apiEndpoint = '/api/entities/concept/base/94';
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);

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
          response.entity.prefLabel.en.should.exist;
        });
      });
    });
  });
});
