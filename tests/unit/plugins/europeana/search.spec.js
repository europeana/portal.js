import nock from 'nock';
import search, { selectedFacetsFromQuery, qfHandler } from '../../../../plugins/europeana/search';

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
      it('includes API key', async() => {
        baseRequest
          .query(query => {
            return query.wskey === apiKey;
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests 24 results by default', async() => {
        baseRequest
          .query(query => {
            return query.rows === '24';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('accepts and uses `rows` option', async() => {
        baseRequest
          .query(query => {
            return query.rows === '9';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', rows: 9, wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('paginates if `page` is passed', async() => {
        baseRequest
          .query(query => {
            return query.rows === '24' && query.start === '25';
          })
          .reply(200, defaultResponse);

        await search({ page: 2, query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('does not request rows beyond API limit', async() => {
        baseRequest
          .query(query => {
            return query.rows === '16' && query.start === '985';
          })
          .reply(200, defaultResponse);

        await search({ page: 42, query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests the minimal & facets profiles', async() => {
        baseRequest
          .query(query => {
            return query.profile === 'minimal,facets';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('includes contentTier query', async() => {
        baseRequest
          .query(query => {
            return query.qf === 'contentTier:(1 OR 2 OR 3 OR 4)';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('requests default facets if `facet` param absent', async() => {
        baseRequest
          .query(query => {
            return query.facet === 'TYPE,REUSABILITY,COUNTRY,LANGUAGE,PROVIDER,DATA_PROVIDER,COLOURPALETTE,IMAGE_ASPECTRATIO,IMAGE_SIZE,MIME_TYPE';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('uses the supplied `facet` param', async() => {
        baseRequest
          .query(query => {
            return query.facet === 'LANGUAGE';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', facet: 'LANGUAGE', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('uses the supplied `facet` param when using comma seperated list', async() => {
        baseRequest
          .query(query => {
            return query.facet === 'COUNTRY,REUSABILITY';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', facet: 'COUNTRY,REUSABILITY', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('maps blank `query` to "*:*"', async() => {
        baseRequest
          .query(query => {
            return query['query'] === '*:*';
          })
          .reply(200, defaultResponse);

        await search({ query: '', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('filters by reusability', async() => {
        baseRequest
          .query(query => {
            return query.reusability === 'open';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', reusability: 'open', wskey: apiKey });

        nock.isDone().should.be.true;
      });

      it('filters by theme', async() => {
        baseRequest
          .query(query => {
            return query.theme === 'art';
          })
          .reply(200, defaultResponse);

        await search({ query: 'anything', theme: 'art', wskey: apiKey });

        nock.isDone().should.be.true;
      });

    });

    describe('API response', () => {
      context('with error', () => {
        it('returns API error message and status code', async() => {
          const errorMessage = 'Invalid query parameter.';
          baseRequest
            .query(true)
            .reply(400, {
              success: false,
              error: errorMessage
            });

          let error;
          try {
            await search({ query: 'NOT ', wskey: apiKey });
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(400);
        });
      });

      context('with `items`', () => {
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

        it('returns results', async() => {
          const response = await searchResponse();

          response.results.length.should.eq(apiResponse.items.length);
        });

        it('returns totalResults', async() => {
          const response = await searchResponse();

          response.totalResults.should.eq(apiResponse.totalResults);
        });

        it('returns lastAvailablePage as false', async() => {
          const response = await searchResponse();

          response.lastAvailablePage.should.eq(false);
        });

        describe('when page is at the API limit', () => {
          function searchResponse() {
            return search({ query: 'painting', wskey: apiKey, page: 42 });
          }

          it('returns lastAvailablePage as true', async() => {
            const response = await searchResponse();

            response.lastAvailablePage.should.eq(true);
          });
        });

        describe('each member of .results', () => {
          it('includes Europeana ID in .europeanaId', async() => {
            const response = await searchResponse();

            response.results[0].europeanaId.should.eq(apiResponse.items[0].id);
          });

          describe('.fields', () => {
            it('includes dcTitleLangAware in .dcTitle', async() => {
              const response = await searchResponse();

              response.results[0].fields.dcTitle.should.deep.eq(apiResponse.items[0].dcTitleLangAware['en']);
            });

            it('includes dcCreatorLangAware in .dcCreator', async() => {
              const response = await searchResponse();

              response.results[0].fields.dcCreator.should.deep.eq(apiResponse.items[0].dcCreatorLangAware['en']);
            });

            it('includes dataProvider in .edmDataProvider', async() => {
              const response = await searchResponse();

              response.results[0].fields.edmDataProvider.should.deep.eq(apiResponse.items[0].dataProvider);
            });
          });
        });

        describe('facets', () => {
          describe('when absent', () => {
            it('returns `[]`', async() => {
              baseRequest
                .query(true)
                .reply(200, defaultResponse);

              const response = await search({ query: 'anything', wskey: apiKey });

              response.facets.should.eql([]);
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

            it('are each returned as-is', async() => {
              const response = await search({ query: 'anything', wskey: apiKey });

              response.facets.should.deep.eql(apiResponse.facets);
            });
          });
        });
      });
    });
  });

  describe('selectedFacetsFromQuery()', () => {
    context('with `null` query qf', () => {
      it('returns {}', () => {
        selectedFacetsFromQuery({ qf: null }).should.eql({});
      });
    });

    context('with single query qf value', () => {
      it('returns it in an array on a property named for the facet', () => {
        selectedFacetsFromQuery({ qf: 'TYPE:"IMAGE"' }).should.deep.eql({ 'TYPE': ['IMAGE'] });
      });
    });

    context('with multiple query qf values', () => {
      it('returns them in arrays on properties named for each facet', () => {
        const query = { qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:"open"'] };
        const expected = { 'TYPE': ['IMAGE', 'VIDEO'], 'REUSABILITY': ['open'] };

        selectedFacetsFromQuery(query).should.deep.eql(expected);
      });
    });

    context('with reusability values', () => {
      it('returns them in an array on REUSABILITY property', () => {
        const query = { reusability: 'open,restricted' };
        const expected = { 'REUSABILITY': ['open', 'restricted'] };
        selectedFacetsFromQuery(query).should.deep.eql(expected);
      });
    });
  });

  describe('qfHandler', () => {
    context('with no qf', () => {
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        qfHandler().should.deep.eql(expected);
      });
    });
    context('with an empty array as qf', () => {
      const qf = [];
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        qfHandler(qf).should.deep.eql(expected);
      });
    });
    context('with a single non contentTier qf', () => {
      const qf = 'TYPE:"IMAGE"';
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        qfHandler(qf).should.deep.eql(expected);
      });
    });
    context('with a contentTier qf', () => {
      const qf = 'contentTier:3';
      it('returns the qf as is', () => {
        const expected = ['contentTier:3'];
        qfHandler(qf).should.deep.eql(expected);
      });
    });
    context('with multiple qfs', () => {
      const qf = ['TYPE:"IMAGE"', 'REUSABILITY:"open"'];
      it('returns the qf with the tier filter appended', () => {
        const expected = ['TYPE:"IMAGE"', 'REUSABILITY:"open"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        qfHandler(qf).should.deep.eql(expected);
      });
    });
    context('with a contentTier qf of "*"', () => {
      const qf = 'contentTier:*';
      it('returns the qf without the qf', () => {
        const expected = [];
        qfHandler(qf).should.deep.eql(expected);
      });
    });
  });
});
