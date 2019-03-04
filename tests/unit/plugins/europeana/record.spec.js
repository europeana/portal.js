import nock from 'nock';
import getRecord from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/record/test/thisisatest.json';
const apiKey = 'abcdef';
const path = 'test/thisisatest';

describe('plugins/europeana/record', () => {
  describe('getRecord()', () => {

    describe('when trying to request an unknown record', () => {
      const errorMessage = 'Invalid record identifier';
      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(400, {
            record: null,
            error: errorMessage
          });
      });

      it('returns API error message', () => {
        const response = getRecord({
          path: path,
          key: apiKey
        });
        return response.should.eventually.have.property('error', errorMessage);
      });
    });

    describe('when trying to request a record', () => {
      const apiResponse = {
        success: true,
        object: {
          aggregations: [{
            edmIsShownAt: 'https://thisisalink.eu',
            webResources: [{
              about: 'https://thisistheabout.eu',
              dcDescription: 'This is a description',
              webResourceEdmRights: 'These are the rights'
            }]
          }],
          europeanaAggregation: {
            edmLanguage: { def: [ 'en' ] },
            edmRights: { def: [ 'http://rightsstatements.org/vocab/InC/1.0/' ] },
            edmPreview: 'https://thisisapreview.eu'
          },
          proxies: [{
            europeanaProxy: false
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
        const response = getRecord({
          path: path,
          key: apiKey
        });
        return response.should.eventually.have.property('record');
      });
    });
  });
});
