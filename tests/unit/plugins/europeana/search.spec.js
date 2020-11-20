import nock from 'nock';
import search, {
  addContentTierFilter, rangeToQueryParam, rangeFromQueryParam
} from '../../../../plugins/europeana/search';
import record, { BASE_URL } from '../../../../plugins/europeana/record';

const $axios = record().$axios;

const apiEndpoint = '/search.json';

const baseRequest = nock(BASE_URL).get(apiEndpoint);
const defaultResponse = { success: true, items: [], totalResults: 123456 };

describe('plugins/europeana/search', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('search($axios).search($axios)', () => {
    describe('API request', () => {
      it('requests 24 results by default', async() => {
        baseRequest
          .query(query => {
            return query.rows === '24';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything' });

        nock.isDone().should.be.true;
      });

      it('accepts and uses `rows` option', async() => {
        baseRequest
          .query(query => {
            return query.rows === '9';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything', rows: 9 });

        nock.isDone().should.be.true;
      });

      it('paginates if `page` is passed', async() => {
        baseRequest
          .query(query => {
            return query.rows === '24' && query.start === '25';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ page: 2, query: 'anything' });

        nock.isDone().should.be.true;
      });

      it('does not request rows beyond API limit', async() => {
        baseRequest
          .query(query => {
            return query.rows === '16' && query.start === '985';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ page: 42, query: 'anything' });

        nock.isDone().should.be.true;
      });

      it('includes contentTier query', async() => {
        baseRequest
          .query(query => {
            return query.qf === 'contentTier:(1 OR 2 OR 3 OR 4)';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything' });

        nock.isDone().should.be.true;
      });

      it('uses the supplied `facet` param', async() => {
        baseRequest
          .query(query => {
            return query.facet === 'LANGUAGE';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything', facet: 'LANGUAGE' });

        nock.isDone().should.be.true;
      });

      it('uses the supplied `facet` param when using comma seperated list', async() => {
        baseRequest
          .query(query => {
            return query.facet === 'COUNTRY,REUSABILITY';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything', facet: 'COUNTRY,REUSABILITY' });

        nock.isDone().should.be.true;
      });

      it('maps blank `query` to "*:*"', async() => {
        baseRequest
          .query(query => {
            return query['query'] === '*:*';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: '' });

        nock.isDone().should.be.true;
      });

      it('filters by reusability', async() => {
        baseRequest
          .query(query => {
            return query.reusability === 'open';
          })
          .reply(200, defaultResponse);

        await search($axios).search({ query: 'anything', reusability: 'open' });

        nock.isDone().should.be.true;
      });

      describe('escaping Lucene reserved characters', () => {
        it('does not escape them by default', async() => {
          baseRequest
            .query(query => {
              return query.query === 'dress (red OR blue)';
            })
            .reply(200, defaultResponse);

          await search($axios).search({ query: 'dress (red OR blue)' });

          nock.isDone().should.be.true;
        });

        it('does escape them when options.escape is `true`', async() => {
          baseRequest
            .query(query => {
              return query.query === 'dress \\(red OR blue\\)';
            })
            .reply(200, defaultResponse);

          await search($axios).search({ query: 'dress (red OR blue)' }, { escape: true });

          nock.isDone().should.be.true;
        });
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
            await search($axios).search({ query: 'NOT ' });
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(400);
        });
      });

      context('with `items`', () => {
        function searchResponse() {
          return search($axios).search({ query: 'painting' });
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

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(200, apiResponse);
        });

        it('includes all API response data', async() => {
          const response = await searchResponse();

          for (const key in apiResponse) {
            response[key].should.deep.eql(apiResponse[key]);
          }
        });

        describe('.lastAvailablePage', () => {
          context('when page is not at the API limit', () => {
            it('is `false`', async() => {
              const response = await searchResponse();

              response.lastAvailablePage.should.be.false;
            });
          });

          context('when page is at the API limit', () => {
            function searchResponse() {
              return search($axios).search({ query: 'painting', page: 42 });
            }

            it('is `true`', async() => {
              const response = await searchResponse();

              response.lastAvailablePage.should.be.true;
            });
          });
        });
      });
    });
  });

  describe('addContentTierFilter', () => {
    context('with no qf', () => {
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        addContentTierFilter().should.deep.eql(expected);
      });
    });
    context('with an empty array as qf', () => {
      const qf = [];
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
    context('with a single non contentTier qf', () => {
      const qf = 'TYPE:"IMAGE"';
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
    context('with a contentTier qf', () => {
      const qf = 'contentTier:3';
      it('returns the qf as is', () => {
        const expected = ['contentTier:3'];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
    context('with multiple qfs', () => {
      const qf = ['TYPE:"IMAGE"', 'REUSABILITY:"open"'];
      it('returns the qf with the tier filter appended', () => {
        const expected = ['TYPE:"IMAGE"', 'REUSABILITY:"open"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
    context('with a contentTier qf of "*"', () => {
      const qf = 'contentTier:*';
      it('returns the qf without the qf', () => {
        const expected = [];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
    context('with a collection qf', () => {
      const qf = ['collection:art'];
      it('returns the qf with the tier 2-4 filter applied', () => {
        const expected = ['collection:art', 'contentTier:(2 OR 3 OR 4)'];
        addContentTierFilter(qf).should.deep.eql(expected);
      });
    });
  });

  describe('rangeToQueryParam', () => {
    context('with no start or end', () => {
      it('returns "[* TO *]"', () => {
        const expected = '[* TO *]';
        rangeToQueryParam({}).should.eql(expected);
      });
    });
    context('with only a start', () => {
      it('returns "[START TO *]"', () => {
        const expected = '[START TO *]';
        rangeToQueryParam({ start: 'START' }).should.deep.eql(expected);
      });
    });
    context('with only an end', () => {
      it('returns "[* TO END]"', () => {
        const expected = '[* TO END]';
        rangeToQueryParam({ end: 'END' }).should.deep.eql(expected);
      });
    });
    context('with both start and end', () => {
      it('returns "[START TO END]"', () => {
        const expected = '[START TO END]';
        rangeToQueryParam({ start: 'START', end: 'END' }).should.deep.eql(expected);
      });
    });
  });

  describe('rangeFromQueryParam', () => {
    context('when the pattern does NOT match', () => {
      it('returns null', () => {
        (rangeFromQueryParam('[abc OR xyz]') === null).should.be.true;
      });
    });
    context('with blank start and end values', () => {
      it('returns both values', () => {
        (rangeFromQueryParam('[ TO ]') === null).should.be.true;
      });
    });
    context('with only a start', () => {
      it('returns null for the end', () => {
        const expected = { start: 'START', end: null };
        rangeFromQueryParam('[START TO *]').should.deep.eql(expected);
      });
    });
    context('with only an end', () => {
      it('returns null for the start', () => {
        const expected = { start: null, end: 'END' };
        rangeFromQueryParam('[* TO END]').should.deep.eql(expected);
      });
    });
    context('with both start and end', () => {
      it('returns both values', () => {
        const expected = { start: 'START', end: 'END' };
        rangeFromQueryParam('[START TO END]').should.deep.eql(expected);
      });
    });
    context('with special characters', () => {
      it('returns both values', () => {
        const expected = { start: '10/Новембар/2000', end: 'Value with spaces' };
        rangeFromQueryParam('[10/Новембар/2000 TO Value with spaces]').should.deep.eql(expected);
      });
    });
    context('with quoted values', () => {
      it('returns both values', () => {
        const expected = { start: '"START"', end: '\'END\'' };
        rangeFromQueryParam('["START" TO \'END\']').should.deep.eql(expected);
      });
    });
  });
});
