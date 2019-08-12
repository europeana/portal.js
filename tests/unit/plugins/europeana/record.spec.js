import nock from 'nock';
import getRecord, { isEuropeanaRecordId } from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const europeanaId = '/123/abc';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = `/api/v2/record${europeanaId}.json`;
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);

describe('plugins/europeana/record', () => {
  afterEach(() => {
    nock.cleanAll();
  });

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
              edmIsShownBy: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              webResources: [{
                about: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                dcDescription: {
                  'en': [
                    'This is an example'
                  ]
                },
                webResourceEdmRights: {
                  'def': [
                    'https://example.org'
                  ]
                },
                ebucoreHasMimeType: 'application/pdf'
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

        it('shows a view PDF link', async () => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.pdfLink.should.exist;
        });
      });
    });
  });

  describe('isEuropeanaRecordId()', () => {
    context('with valid record ID', () => {
      it('returns `true`', () => {
        const recordId = '/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        validation.should.equal(true);
      });
    });

    context('with invalid record ID', () => {
      it('returns `false`', () => {
        const recordId = 'http://www.example.org/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        validation.should.equal(false);
      });
    });
  });
});
