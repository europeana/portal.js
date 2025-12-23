import nock from 'nock';

import EuropeanaAnnotationApi from '@/plugins/europeana/annotation';

describe('plugins/europeana/annotation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('search', () => {
    it('searches Annotation API', async() => {
      const apiQuery = '*:*';
      nock(EuropeanaAnnotationApi.BASE_URL)
        .get('/search')
        .query(query => {
          return query.query === apiQuery;
        })
        .reply(200, {});

      await (new EuropeanaAnnotationApi).search({ query: apiQuery });

      expect(nock.isDone()).toBe(true);
    });
  });
});
