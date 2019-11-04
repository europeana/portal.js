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

        it('throws error with API error message and status code', async() => {
          let error;
          try {
            await getRecord(europeanaId, { wskey: apiKey });
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(404);
        });
      });

      describe('with object in response', () => {
        const edmIsShownByWebResource = {
          about: 'https://example.org/doc.pdf',
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
        };
        const edmHasViewWebResource = {
          about: 'https://example.org/image.jpeg',
          ebucoreHasMimeType: 'image/jpeg'
        };
        const someOtherWebResource = {
          about: 'https://example.org/'
        };
        const apiResponse = {
          success: true,
          object: {
            about: europeanaId,
            aggregations: [{
              edmIsShownAt: 'https://example.org',
              edmIsShownBy: 'https://example.org/doc.pdf',
              hasView: ['https://example.org/image.jpeg'],
              webResources: [
                edmIsShownByWebResource,
                edmHasViewWebResource,
                someOtherWebResource
              ]
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
            }],
            agents: [
              { about: 'http://data.europeana.eu/agent/base/123' }
            ],
            concepts: [
              { about: 'http://data.europeana.eu/concept/base/456' }
            ]
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns record data', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.should.exist;
        });

        it('includes identifier', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.identifier.should.eq(europeanaId);
        });

        describe('.media', () => {
          it('includes edmIsShownBy web resource', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.include.deep.members([edmIsShownByWebResource]);
          });

          it('includes edmHasView web resource', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.include.deep.members([edmHasViewWebResource]);
          });

          it('omits other web resources', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.not.include.deep.members([someOtherWebResource]);
          });
        });

        it('includes agents', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.agents.should.deep.eq(apiResponse.object.agents);
        });

        it('includes concepts', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.concepts.should.deep.eq(apiResponse.object.concepts);
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
