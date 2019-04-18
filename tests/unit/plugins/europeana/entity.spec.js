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
              success: false,
              error: errorMessage
            });
        });

        it('throws API error message', () => {
          const response = getEntity(entityId, entityType, { wskey: apiKey });
          return response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with object in response', () => {
        const apiResponse = {
          success: true,
          data: {
            prefLabel: {
              en: 'Architecture'
            }
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async () => {
          const response = await getEntity(entityId, entityType, { wskey: apiKey });
          response.data.data.prefLabel.en.should.exist;
        });
      });
    });
  });
});
