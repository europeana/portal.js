import nock from 'nock';
import search from '../../../../plugins/europeana/search';

import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('plugins/europeana/search', () => {
  describe('search()', () => {
    describe('API request', () => {
      it('includes API key', async () => {
        baseRequest
          .query(query => {
            return query.wskey === apiKey;
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests 24 results', async () => {
        baseRequest
          .query(query => {
            return query.rows === '24';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests the minimal & facets profiles', async () => {
        baseRequest
          .query(query => {
            return query.profile === 'minimal,facets';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests the TYPE facet (only)', async () => {
        baseRequest
          .query(query => {
            return query.facet === 'TYPE';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('ignores supplied `facet` param', async () => {
        baseRequest
          .query(query => {
            return query.facet === 'TYPE';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', facet: 'LANGUAGE', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('maps blank `query` to "*:*"', async () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(query => {
            return query['query'] === '*:*';
          })
          .reply(200, defaultResponse);

        await search({ query: '', wskey: apiKey });

        nock.isDone().should.be.true;
      });
    });

    describe('API response', () => {
      describe('with error', () => {
        it('returns API error message', () => {
          const errorMessage = 'Invalid query parameter.';
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(400, {
              success: false,
              error: errorMessage
            });

          const response = search({ query: 'NOT ', wskey: apiKey });

          response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with items', () => {
        function searchResponse() {
          return search({ query: 'painting', wskey: apiKey });
        }

        const apiResponse = {
          success: true,
          items: [
            {
              id: '/123/abc',
              type: 'IMAGE',
              dcTitleLangAware: {
                en: ['A painting']
              },
              dcCreatorLangAware: {
                en: ['An artist']
              },
              dataProvider: ['Europeana Foundation']
            }
          ],
          itemsCount: 1,
          totalResults: 2
        };

        beforeEach('stub API response', () => {
          nock(apiUrl)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns results', async () => {
          const response = await searchResponse();

          response.results.length.should.eq(apiResponse.items.length);
        });

        it('returns totalResults', async () => {
          const response = await searchResponse();

          response.totalResults.should.eq(apiResponse.totalResults);
        });

        describe('each member of .results', () => {
          it('includes Europeana ID in .europeanaId', async () => {
            const response = await searchResponse();

            response.results[0].europeanaId.should.eq(apiResponse.items[0].id);
          });

          it('includes URL path of record page in .linkTo', async () => {
            const response = await searchResponse();

            response.results[0].linkTo.should.eq(`record${apiResponse.items[0].id}`);
          });

          describe('.fields', () => {
            it('includes dcTitleLangAware in .dcTitle', async () => {
              const response = await searchResponse();

              response.results[0].fields.dcTitle.should.deep.eq(apiResponse.items[0].dcTitleLangAware['en']);
            });

            it('includes dcCreatorLangAware in .dcCreator', async () => {
              const response = await searchResponse();

              response.results[0].fields.dcCreator.should.deep.eq(apiResponse.items[0].dcCreatorLangAware['en']);
            });

            it('includes dataProvider in .edmDataProvider', async () => {
              const response = await searchResponse();

              response.results[0].fields.edmDataProvider.should.deep.eq(apiResponse.items[0].dataProvider);
            });
          });
        });
      });
    });
  });
});
