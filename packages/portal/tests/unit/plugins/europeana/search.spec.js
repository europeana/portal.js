import nock from 'nock';
import search, {
  addContentTierFilter, rangeToQueryParam, rangeFromQueryParam
} from '@/plugins/europeana/search';
import EuropeanaApi from '@/plugins/europeana/apis/base.js';

const apiEndpoint = '/search.json';

const baseRequest = () => nock(EuropeanaApi.BASE_URL).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('plugins/europeana/search', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('search()()', () => {
    describe('API request', () => {
      it('requests 24 results by default', async() => {
        baseRequest()
          .query((query) => {
            return query.rows === '24';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('accepts and uses `rows` option', async() => {
        baseRequest()
          .query((query) => {
            return query.rows === '9';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', rows: 9 });

        expect(nock.isDone()).toBe(true);
      });

      it('paginates if `page` is passed', async() => {
        baseRequest()
          .query((query) => {
            return query.rows === '24' && query.start === '25';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ page: 2, query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('does not request rows beyond API limit', async() => {
        baseRequest()
          .query((query) => {
            return query.rows === '16' && query.start === '985';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ page: 42, query: 'anything' });

        expect(nock.isDone()).toBe(true);
      });

      it('uses the supplied `facet` param', async() => {
        baseRequest()
          .query((query) => {
            return query.facet === 'LANGUAGE';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', facet: 'LANGUAGE' });

        expect(nock.isDone()).toBe(true);
      });

      it('uses the supplied `facet` param when using comma seperated list', async() => {
        baseRequest()
          .query((query) => {
            return query.facet === 'COUNTRY,REUSABILITY';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', facet: 'COUNTRY,REUSABILITY' });

        expect(nock.isDone()).toBe(true);
      });

      it('maps blank `query` to "*:*"', async() => {
        baseRequest()
          .query((query) => {
            return query['query'] === '*:*';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: '' });

        expect(nock.isDone()).toBe(true);
      });

      it('filters by reusability', async() => {
        baseRequest()
          .query((query) => {
            return query.reusability === 'open';
          })
          .reply(200, defaultResponse);

        await search.bind(new EuropeanaApi)({ query: 'anything', reusability: 'open' });

        expect(nock.isDone()).toBe(true);
      });

      describe('multilingual queries', () => {
        it('passes API translation params if translateLang option given', async() => {
          const translateLang = 'es';

          baseRequest()
            .query((query) => {
              return query['q.source'] === translateLang && query['q.target'] === 'en' && query.lang === translateLang;
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'flor' }, { translateLang });

          expect(nock.isDone()).toBe(true);
        });

        it('does not pass API translation params if no translateLang option', async() => {
          baseRequest()
            .query((query) => {
              const queryKeys = Object.keys(query);
              return !queryKeys.includes('q.source') && !queryKeys.includes('q.target');
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'flor' });

          expect(nock.isDone()).toBe(true);
        });

        it('does not pass API translation params if translateLang is "en"', async() => {
          const translateLang = 'en';

          baseRequest()
            .query((query) => {
              const queryKeys = Object.keys(query);
              return !queryKeys.includes('q.source') && !queryKeys.includes('q.target');
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'flor' }, { translateLang });

          expect(nock.isDone()).toBe(true);
        });
      });

      describe('escaping Lucene reserved characters', () => {
        it('does not escape them by default', async() => {
          baseRequest()
            .query((query) => {
              return query.query === 'dress (red OR blue)';
            })
            .reply(200, defaultResponse);

          await search.bind(new EuropeanaApi)({ query: 'dress (red OR blue)' });

          expect(nock.isDone()).toBe(true);
        });

        it('does escape them when options.escape is `true`', async() => {
          baseRequest()
            .query((query) => {
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
            .query((query) => {
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

        describe('.items', () => {
          describe('are reduced to data needed for display', () => {
            const bloatedResponse = {
              success: true,
              items: [
                {
                  id: '/123/abc',
                  type: 'IMAGE',
                  dataProvider: ['Europeana Foundation'],
                  title: ['A painting', 'Een schilderij'],
                  dcTitleLangAware: {
                    en: ['A painting'],
                    nl: ['Een schilderij']
                  },
                  dcDescription: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting.'],
                  dcDescriptionLangAware: {
                    en: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting.']
                  },
                  dcCreatorLangAware: {
                    en: ['An artist']
                  },
                  edmPreview: ['https://example.org/thumbnail/123/abc.jpeg']
                }
              ],
              itemsCount: 1,
              totalResults: 2
            };

            beforeEach(() => {
              baseRequest()
                .query(true)
                .reply(200, bloatedResponse);
            });

            it('preserves required non-LangMap fields', async() => {
              const response = await searchResponse({ locale: 'en' });
              const item = response.items[0];

              expect(item.id).toBe('/123/abc');
              expect(item.type).toBe('IMAGE');
              expect(item.dataProvider).toEqual(['Europeana Foundation']);
              expect(item.edmPreview).toEqual(['https://example.org/thumbnail/123/abc.jpeg']);
            });

            it('removes irrelevant LangMap locales', async() => {
              const response = await searchResponse({ locale: 'en' });
              const item = response.items[0];

              expect(item.dcTitleLangAware).toEqual({ en: ['A painting'] });
              expect(item.dcCreatorLangAware).toEqual({ en: ['An artist'] });
            });

            it('truncates long LangMap values', async() => {
              const response = await searchResponse({ locale: 'en' });
              const item = response.items[0];

              expect(item.dcDescriptionLangAware).toEqual({ en: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this …'] });
            });

            it('removes irrelevant fields', async() => {
              const response = await searchResponse({ locale: 'en' });
              const item = response.items[0];

              expect(item.title === undefined).toBe(true);
              expect(item.dcDescription === undefined).toBe(true);
            });
          });
        });

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

  describe('addContentTierFilter', () => {
    describe('with no qf', () => {
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter()).toEqual(expected);
      });
    });
    describe('with an empty array as qf', () => {
      const qf = [];
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a single non contentTier qf', () => {
      const qf = 'TYPE:"IMAGE"';
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a contentTier qf', () => {
      const qf = 'contentTier:3';
      it('returns the qf as is', () => {
        const expected = ['contentTier:3'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with multiple qfs', () => {
      const qf = ['TYPE:"IMAGE"', 'REUSABILITY:"open"'];
      it('returns the qf with the tier filter appended', () => {
        const expected = ['TYPE:"IMAGE"', 'REUSABILITY:"open"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a contentTier qf of "*"', () => {
      const qf = 'contentTier:*';
      it('returns the qf without the qf', () => {
        const expected = [];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a collection qf', () => {
      const qf = ['collection:art'];
      it('returns the qf with the tier 2-4 filter applied', () => {
        const expected = ['collection:art', 'contentTier:(2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with an foaf_organization qf', () => {
      const qf = ['foaf_organization:"http://data.europeana.eu/organization/1234567890"'];
      it('returns the qf with no content tier filter applied', () => {
        const expected = qf;
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
  });

  describe('rangeToQueryParam', () => {
    describe('with no start or end', () => {
      it('returns "[* TO *]"', () => {
        const expected = '[* TO *]';
        expect(rangeToQueryParam({})).toEqual(expected);
      });
    });
    describe('with only a start', () => {
      it('returns "[START TO *]"', () => {
        const expected = '[START TO *]';
        expect(rangeToQueryParam({ start: 'START' })).toEqual(expected);
      });
    });
    describe('with only an end', () => {
      it('returns "[* TO END]"', () => {
        const expected = '[* TO END]';
        expect(rangeToQueryParam({ end: 'END' })).toEqual(expected);
      });
    });
    describe('with both start and end', () => {
      it('returns "[START TO END]"', () => {
        const expected = '[START TO END]';
        expect(rangeToQueryParam({ start: 'START', end: 'END' })).toEqual(expected);
      });
    });
  });

  describe('rangeFromQueryParam', () => {
    describe('when the pattern does NOT match', () => {
      it('returns null', () => {
        expect(rangeFromQueryParam('[abc OR xyz]')).toBe(null);
      });
    });
    describe('with blank start and end values', () => {
      it('returns both values', () => {
        expect(rangeFromQueryParam('[ TO ]')).toBe(null);
      });
    });
    describe('with only a start', () => {
      it('returns null for the end', () => {
        const expected = { start: 'START', end: null };
        expect(rangeFromQueryParam('[START TO *]')).toEqual(expected);
      });
    });
    describe('with only an end', () => {
      it('returns null for the start', () => {
        const expected = { start: null, end: 'END' };
        expect(rangeFromQueryParam('[* TO END]')).toEqual(expected);
      });
    });
    describe('with both start and end', () => {
      it('returns both values', () => {
        const expected = { start: 'START', end: 'END' };
        expect(rangeFromQueryParam('[START TO END]')).toEqual(expected);
      });
    });
    describe('with special characters', () => {
      it('returns both values', () => {
        const expected = { start: '10/Новембар/2000', end: 'Value with spaces' };
        expect(rangeFromQueryParam('[10/Новембар/2000 TO Value with spaces]')).toEqual(expected);
      });
    });
    describe('with quoted values', () => {
      it('returns both values', () => {
        const expected = { start: '"START"', end: '\'END\'' };
        expect(rangeFromQueryParam('["START" TO \'END\']')).toEqual(expected);
      });
    });
  });
});
