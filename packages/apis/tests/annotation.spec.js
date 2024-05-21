import nock from 'nock';

import EuropeanaAnnotationApi from '@/annotation.js';

describe('@/annotation.js', () => {
  describe('EuropeanaAnnotationApi', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(nock.cleanAll);

    afterAll(() => {
      nock.enableNetConnect();
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
});
