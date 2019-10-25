import nock from 'nock';
import getItem, { isEuropeanaIdentifier } from '../../../../plugins/europeana/item';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const europeanaId = '/123/abc';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = `/api/v2/record${europeanaId}.json`;
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);

describe('plugins/europeana/item', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getItem()', () => {
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
            await getItem(europeanaId, { wskey: apiKey });
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
            }]
          }
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns item data', async() => {
          const response = await getItem(europeanaId, { wskey: apiKey });
          response.item.should.exist;
        });

        describe('.media', () => {
          it('includes edmIsShownBy web resource', async() => {
            const response = await getItem(europeanaId, { wskey: apiKey });
            response.item.media.should.include.deep.members([edmIsShownByWebResource]);
          });

          it('includes edmHasView web resource', async() => {
            const response = await getItem(europeanaId, { wskey: apiKey });
            response.item.media.should.include.deep.members([edmHasViewWebResource]);
          });

          it('omits other web resources', async() => {
            const response = await getItem(europeanaId, { wskey: apiKey });
            response.item.media.should.not.include.deep.members([someOtherWebResource]);
          });
        });
      });
    });
  });

  describe('isEuropeanaIdentifier()', () => {
    context('with valid ID', () => {
      it('returns `true`', () => {
        const id = '/123456/abcdef_7890';

        const validation = isEuropeanaIdentifier(id);

        validation.should.equal(true);
      });
    });

    context('with invalid ID', () => {
      it('returns `false`', () => {
        const id = 'http://www.example.org/123456/abcdef_7890';

        const validation = isEuropeanaIdentifier(id);

        validation.should.equal(false);
      });
    });
  });
});
