// TODO: consider using chai-nock
import nock from 'nock';
import search from '../../../../plugins/europeana/search';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/search.json';
const apiKey = 'abcdef';

describe('plugins/europeana/search', () => {
  describe('search()', () => {
    it('requests 24 results', async () => {
      nock(apiUrl)
        .get(apiEndpoint)
        .query(actualQueryObject => {
          return actualQueryObject.rows === '24';
        })
        .reply(200, {
          success: true,
          items: [],
          totalResults: 123456
        });
      await search({ query: 'anything', wskey: apiKey });

      return nock.isDone().should.eq(true);
    });

    it('requests the minimal profile', async () => {
      nock(apiUrl)
        .get(apiEndpoint)
        .query(actualQueryObject => {
          return actualQueryObject.profile === 'minimal';
        })
        .reply(200, {
          success: true,
          items: [],
          totalResults: 123456
        });
      await search({ query: 'anything', wskey: apiKey });

      return nock.isDone().should.eq(true);
    });

    describe('when API responds with error', () => {
      const errorMessage = 'Invalid query parameter.';

      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(400, {
            success: false,
            error: errorMessage
          });
      });

      it('returns API error message', () => {
        const response = search({ query: 'NOT ', wskey: apiKey });

        return response.should.be.rejectedWith(errorMessage);
      });
    });

    describe('when query is blank', () => {
      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(query => {
            if (query['query'] === '*:*') {
              return true;
            }
          })
          .reply(200, {
            success: true,
            items: [],
            totalResults: 123456
          });
      });

      it('maps the query to *:*', () => {
        const response = search({ query: '', wskey: apiKey });

        return response.should.eventually.have.property('totalResults', 123456);
      });
    });

    describe('when API response includes items', () => {
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

      it('returns results', () => {
        return searchResponse().should.eventually.have.property('results').to.have.lengthOf(apiResponse.items.length);
      });

      it('returns totalResults', () => {
        return searchResponse().should.eventually.have.property('totalResults', apiResponse.totalResults);
      });

      // TODO: how can we DRY these up with Chai as Promised?
      describe('each member of .results', () => {
        it('includes Europeana ID in .europeanaId', () => {
          searchResponse().then((r) => {
            return r.results[0].should.have.property('europeanaId', apiResponse.items[0].id);
          }).catch((err) => {
            done(err);
          });
        });
        it('includes URL path of record page in .linkTo', () => {
          searchResponse().then((r) => {
            return r.results[0].should.have.property('linkTo', `record${apiResponse.items[0].id}`);
          }).catch((err) => {
            done(err);
          });
        });
        describe('.fields', () => {
          it('includes dcTitleLangAware in .dcTitle', () => {
            searchResponse().then((r) => {
              return r.results[0].fields.dcTitle.should.deep.equal(apiResponse.items[0].dcTitleLangAware['en']);
            }).catch((err) => {
              done(err);
            });
          });
          it('includes dcCreatorLangAware in .dcCreator', () => {
            searchResponse().then((r) => {
              return r.results[0].fields.dcCreator.should.deep.equal(apiResponse.items[0].dcCreatorLangAware['en']);
            }).catch((err) => {
              done(err);
            });
          });
          it('includes dataProvider in .edmDataProvider', () => {
            searchResponse().then((r) => {
              return r.results[0].fields.edmDataProvider.should.deep.equal(apiResponse.items[0].dataProvider);
            }).catch((err) => {
              done(err);
            });
          });
        });
      });
    });
  });
});
