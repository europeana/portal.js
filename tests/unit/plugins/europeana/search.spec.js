import nock from 'nock';
import search, { pageFromQuery } from '../../../../plugins/europeana/search';

import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';
const apiKey = 'abcdef';

const baseRequest = nock(apiUrl).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('plugins/europeana/search', () => {
  afterEach(() => {
    nock.cleanAll();
  });

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

      it('paginates if `page` is passed', async () => {
        baseRequest
          .query(query => {
            return query.rows === '24' && query.start === '25';
          })
          .reply(200, defaultResponse);

        await search({ page: 2, query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('does not request rows beyond API limit', async () => {
        baseRequest
          .query(query => {
            return query.rows === '16' && query.start === '985';
          })
          .reply(200, defaultResponse);

        await search({ page: 42, query: 'anything', wskey: apiKey });

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

      it('requests the `TYPE` facet (only)', async () => {
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
        baseRequest
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
          baseRequest
            .query(true)
            .reply(400, {
              success: false,
              error: errorMessage
            });

          const response = search({ query: 'NOT ', wskey: apiKey });

          response.should.be.rejectedWith(errorMessage);
        });
      });

      describe('with `items`', () => {
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
          baseRequest
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

        describe('facets', () => {
          describe('when absent', () => {
            it('returns `null`', async () => {
              baseRequest
                .query(true)
                .reply(200, defaultResponse);

              const response = await search({ query: 'anything', wskey: apiKey });

              (response.facets === null).should.be.true;
            });
          });

          describe('when present', () => {
            const typeFacet = {
              name: 'TYPE',
              fields: [
                { label: 'IMAGE', count: 33371202 },
                { label: 'TEXT', count: 22845674 },
                { label: 'VIDEO', count: 1137194 },
                { label: 'SOUND', count: 699155 },
                { label: '3D', count: 28460  }
              ]
            };
            const apiResponse = {
              success: true,
              items: [],
              totalResults: 58081685,
              facets: [typeFacet]
            };

            beforeEach('stub API response', () => {
              baseRequest
                .query(true)
                .reply(200, apiResponse);
            });

            it('are each returned as name => Object', async () => {
              const response = await search({ query: 'anything', wskey: apiKey });

              response.facets.should.have.property('TYPE');
              response.facets['TYPE'].should.be.an('object');
            });

            it('have each field returned as label => count', async () => {
              const response = await search({ query: 'anything', wskey: apiKey });

              for (let field of typeFacet.fields) {
                response.facets['TYPE'].should.have.property(field.label);
                response.facets['TYPE'][field.label].should.eq(field.count);
              }
            });
          });
        });
      });
    });
  });

  describe('pageFromQuery()', () => {
    describe('with no value', () => {
      it('returns `1`', () => {
        for (const queryPage of [null, undefined]) {
          pageFromQuery(queryPage).should.eq(1);
        }
      });
    });

    describe('with invalid value', () => {
      it('returns `null`', () => {
        for (const queryPage of ['0', '-1', '3.5', 'one', 'last']) {
          (pageFromQuery(queryPage) === null).should.be.true;
        }
      });
    });

    describe('with valid value', () => {
      it('returns it typecast as `Number`', () => {
        for (const queryPage of ['1', '2', '20']) {
          pageFromQuery(queryPage).should.eq(Number(queryPage));
        }
      });
    });
  });
});
