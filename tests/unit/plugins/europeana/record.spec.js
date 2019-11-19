import nock from 'nock';
import getRecord, {
  isEuropeanaRecordId, similarItemsQuery
} from '../../../../plugins/europeana/record';

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
        const edmIsShownAt = 'https://example.org';
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
        const edmHasViewWebResourceFirst = {
          about: 'https://example.org/image1.jpeg',
          ebucoreHasMimeType: 'image/jpeg',
          isNextInSequence: edmIsShownByWebResource.about
        };
        const edmHasViewWebResourceSecond = {
          about: 'https://example.org/image2.jpeg',
          ebucoreHasMimeType: 'image/jpeg',
          isNextInSequence: edmHasViewWebResourceFirst.about
        };
        const edmHasViewWebResourceThird = {
          about: 'https://example.org/image3.jpeg',
          ebucoreHasMimeType: 'image/jpeg',
          isNextInSequence: edmHasViewWebResourceSecond.about
        };
        const someOtherWebResource = {
          about: 'https://example.org/'
        };
        const type = 'TEXT';
        const apiResponse = {
          success: true,
          object: {
            about: europeanaId,
            aggregations: [{
              edmIsShownAt,
              edmIsShownBy: edmIsShownByWebResource.about,
              hasView: [edmHasViewWebResourceSecond.about, edmHasViewWebResourceThird.about, edmHasViewWebResourceFirst.about],
              webResources: [
                edmIsShownByWebResource,
                edmHasViewWebResourceSecond,
                edmHasViewWebResourceThird,
                edmHasViewWebResourceFirst,
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
            ],
            type
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

        it('includes edmIsShownAt', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.isShownAt.should.eq(edmIsShownAt);
        });

        it('includes type', async() => {
          const response = await getRecord(europeanaId, { wskey: apiKey });
          response.record.type.should.eq(type);
        });

        describe('.media', () => {
          it('includes edmIsShownBy web resource', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.include.deep.members([edmIsShownByWebResource]);
          });

          it('includes edmHasView web resource', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.include.deep.members([
              edmHasViewWebResourceFirst, edmHasViewWebResourceSecond, edmHasViewWebResourceThird
            ]);
          });

          it('omits other web resources', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });
            response.record.media.should.not.include.deep.members([someOtherWebResource]);
          });

          it('sorts by isNextInSequence', async() => {
            const response = await getRecord(europeanaId, { wskey: apiKey });

            response.record.media[0].should.deep.eq(edmIsShownByWebResource);
            response.record.media[1].should.deep.eq(edmHasViewWebResourceFirst);
            response.record.media[2].should.deep.eq(edmHasViewWebResourceSecond);
            response.record.media[3].should.deep.eq(edmHasViewWebResourceThird);
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

  describe('similarItemsQuery()', () => {
    const about = '/12345/abcde';

    it('fields on `what` for dcType, boosted by 0.8', () => {
      const data = {
        dcType: ['Type']
      };

      similarItemsQuery(about, data).should.include('what:("Type")^0.8');
    });

    it('fields on `what` for dcSubject, boosted by 0.8', () => {
      const data = {
        dcSubject: ['Subject']
      };

      similarItemsQuery(about, data).should.include('what:("Subject")^0.8');
    });

    it('fields on `who` for dcCreator, boosted by 0.5', () => {
      const data = {
        dcCreator: ['Creator']
      };

      similarItemsQuery(about, data).should.include('who:("Creator")^0.5');
    });

    it('fields on `DATA_PROVIDER` for edmDataProvider, boosted by 0.2', () => {
      const data = {
        edmDataProvider: ['Data Provider']
      };

      similarItemsQuery(about, data).should.include('DATA_PROVIDER:("Data Provider")^0.2');
    });

    it('excludes the current item by `europeana_id`', () => {
      const data = {
        dcType: ['Type']
      };

      similarItemsQuery(about, data).should.include(' NOT europeana_id:"/12345/abcde"');
    });

    it('escapes Lucene special characters in each term', () => {
      const data = {
        dcType: ['http://www.example.org/vocabulary/term']
      };

      similarItemsQuery(about, data).should.include('"http\\:\\/\\/www.example.org\\/vocabulary\\/term"');
    });

    it('combines each term per-field with OR', () => {
      const data = {
        dcSubject: ['Subject1'],
        dcType: ['Type1', 'Type2']
      };

      similarItemsQuery(about, data).should.include('("Subject1" OR "Type1" OR "Type2")');
    });

    it('combines all fielded terms with OR', () => {
      const data = {
        dcCreator: ['Creator'],
        dcType: ['Type']
      };

      similarItemsQuery(about, data).should.include('(what:("Type")^0.8 OR who:("Creator")^0.5)');
    });

    it('handles no relevant query terms sensibly', () => {
      const data = {};

      (similarItemsQuery(about, data) === null).should.be.true;
    });
  });
});
