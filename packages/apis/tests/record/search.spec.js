import nock from 'nock';
import search from '@/record/search.js';
import EuropeanaApi from '@/base.js';

const apiEndpoint = '/search.json';

const baseRequest = () => nock(EuropeanaApi.BASE_URL).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('@/record/search.js', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(nock.cleanAll);

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('search', () => {
    describe('API request', () => {
      it('requests 24 results by default', async() => {
        baseRequest()
          .query(query => {
            return query.rows === '24';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('accepts and uses `rows` option', async() => {
        baseRequest()
          .query(query => {
            return query.rows === '9';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', rows: 9 });

        expect(nock.isDone()).toBe(true);
      });

      it('paginates if `page` is passed', async() => {
        baseRequest()
          .query(query => {
            return query.rows === '24' && query.start === '25';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ page: 2, query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('does not request rows beyond API limit', async() => {
        baseRequest()
          .query(query => {
            return query.rows === '16' && query.start === '985';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ page: 42, query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('uses the supplied `facet` param', async() => {
        baseRequest()
          .query(query => {
            return query.facet === 'LANGUAGE';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', facet: 'LANGUAGE' });

        expect(nock.isDone()).toBe(true);
      });

      it('uses the supplied `facet` param when using comma seperated list', async() => {
        baseRequest()
          .query(query => {
            return query.facet === 'COUNTRY,REUSABILITY';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', facet: 'COUNTRY,REUSABILITY' });

        expect(nock.isDone()).toBe(true);
      });

      it('maps blank `query` to "*:*"', async() => {
        baseRequest()
          .query(query => {
            return query['query'] === '*:*';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: '' });

        expect(nock.isDone()).toBe(true);
      });

      it('filters by reusability', async() => {
        baseRequest()
          .query(query => {
            return query.reusability === 'open';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', reusability: 'open' });

        expect(nock.isDone()).toBe(true);
      });

      describe('escaping Lucene reserved characters', () => {
        it('does not escape them by default', async() => {
          baseRequest()
            .query(query => {
              return query.query === 'dress (red OR blue)';
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'dress (red OR blue)' });

          expect(nock.isDone()).toBe(true);
        });

        it('does escape them when options.escape is `true`', async() => {
          baseRequest()
            .query(query => {
              return query.query === 'dress \\(red OR blue\\)';
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'dress (red OR blue)' }, { escape: true });

          expect(nock.isDone()).toBe(true);
        });
      });
    });

    describe('boost params', () => {
      describe('with a boost in the params', () => {
        it('sends the boosting param', async() => {
          baseRequest()
            .query(query => {
              return query['boost'] === 'BOOST';
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'test', boost: 'BOOST' });

          expect(nock.isDone()).toBe(true);
        });
      });
    });

    describe('API response', () => {
      describe('with `items`', () => {
        function searchResponse(options = {}) {
          return search.bind(new EuropeanaApi)({ query: 'painting' }, options);
        }

        describe('.lastAvailablePage', () => {
          const apiResponse = {
            success: true,
            items: [
              {
                id: '/123/abc',
                type: 'IMAGE',
                dcTitleLangAware: {
                  en: ['A painting']
                },
                dcDescriptionLangAware: {
                  en: ['More information about this painting']
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

          beforeEach(() => {
            baseRequest()
              .query(true)
              .reply(200, apiResponse);
          });

          describe('when page is not at the API limit', () => {
            it('is `false`', async() => {
              const response = await searchResponse();

              expect(response.lastAvailablePage).toBe(false);
            });
          });

          describe('when page is at the API limit', () => {
            function searchResponse() {
              return search.bind(new EuropeanaApi)({ query: 'painting', page: 42 });
            }

            it('is `true`', async() => {
              const response = await searchResponse();

              expect(response.lastAvailablePage).toBe(true);
            });
          });
        });
      });
    });
  });
});
