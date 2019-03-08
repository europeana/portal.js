import nock from 'nock';
import getRecord from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const europeanaId = '/123/abc';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = `/api/v2/record${europeanaId}.json`;
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);

describe('plugins/europeana/record', () => {
  describe('getRecord()', () => {
    describe('API response', () => {
      describe('with "Invalid record identifier: ..." error', () => {
        const errorMessage = `Invalid record identifier: ${europeanaId}`;

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(404, {
              success: false,
              error: errorMessage
            });
        });

        it('throws API error message', () => {
          const response = getRecord(europeanaId, { wskey: apiKey });

          return response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with object in response', () => {
        const apiResponse = {
          success: true,
          object: {
            aggregations: [{
              edmIsShownAt: 'https://example.org',
              webResources: [{
                about: 'https://example.org',
                dcDescription: {
                  'en': [
                    'This is an example'
                  ]
                },
                webResourceEdmRights: {
                  'def': [
                    'https://example.org'
                  ]
                }
              }]
            }],
            europeanaAggregation: {
              edmRights: { def: [ 'https://example.org' ] },
              edmPreview: 'https://example.org'
            },
            proxies: [{
              europeanaProxy: false,
              dcTitle: {
                'en': [
                  'This is a title'
                ]
              },
              dcDescription: {
                'en': [
                  'This is a description'
                ]
              }
            }]
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns record data', async () => {
          const response = await getRecord(europeanaId, { wskey: apiKey });

          response.record.should.exist;
        });
      });
    });
  });
});
