import nock from 'nock';

import annotation, { BASE_URL } from '../../../../plugins/europeana/annotation';

describe('plugins/europeana/entity', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('search', () => {
    it('searches Annotation API', async() => {
      const apiQuery = '*:*';
      nock(BASE_URL)
        .get('/search')
        .query(query => {
          return query.query === apiQuery;
        })
        .reply(200, {});

      await annotation().search({ query: apiQuery });

      nock.isDone().should.be.true;
    });
  });
});
