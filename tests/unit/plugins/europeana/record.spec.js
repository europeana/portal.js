import nock from 'nock';
import getRecord from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const europeanaId = '/123/abc';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = `/api/v2/record${europeanaId}.json`;
const apiKey = 'abcdef';

describe('plugins/europeana/record', () => {
  describe('getRecord()', () => {

    describe('when trying to request an unknown record', () => {
      const errorMessage = `Invalid record identifier: ${europeanaId}`;

      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
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

    describe('when trying to request a record', () => {
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
            edmLanguage: { def: [ 'en' ] },
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

      it('returns record data', () => {
        const response = getRecord(europeanaId, { wskey: apiKey });

        return response.should.eventually.have.property('record');
      });
    });
  });
});
