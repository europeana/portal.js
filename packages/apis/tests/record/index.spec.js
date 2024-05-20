import nock from 'nock';
import EuropeanaRecordApi from '@/record/index.js';

const europeanaId = '/123/abc';
const apiEndpoint = `${europeanaId}.json`;

const apiResponse = {
  success: true,
  object: {
    about: europeanaId
  }
};

describe('@/record/index.js', () => {
  describe('EuropeanaRecordApi', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(nock.cleanAll);

    afterAll(() => {
      nock.enableNetConnect();
    });

    describe('EuropeanaRecordApi', () => {
      it('is authenticating', () => {
        expect(EuropeanaRecordApi.AUTHENTICATING).toBe(true);
      });

      it('is authorising', () => {
        expect(EuropeanaRecordApi.AUTHORISING).toBe(true);
      });
    });

    describe('EuropeanaRecordApi().get()', () => {
      it('makes an API request', async() => {
        nock(EuropeanaRecordApi.BASE_URL)
          .get(apiEndpoint)
          .query(true)
          .reply(200, apiResponse);

        await (new EuropeanaRecordApi).get(europeanaId);

        expect(nock.isDone()).toBe(true);
      });

      it('returns data from API', async() => {
        nock(EuropeanaRecordApi.BASE_URL)
          .get(apiEndpoint)
          .query(true)
          .reply(200, apiResponse);

        const response = await (new EuropeanaRecordApi).get(europeanaId);

        expect(response).toEqual(apiResponse);
      });
    });

    describe('EuropeanaRecordApi().find()', () => {
      it('searches the Record API for specified item IDs', async() => {
        const ids = ['/123/abc', '/123/def'];
        nock(EuropeanaRecordApi.BASE_URL)
          .get('/search.json')
          .query(query => {
            return query.profile === 'minimal' &&
              !query.qf &&
              query.query === 'europeana_id:("/123/abc" OR "/123/def")';
          })
          .reply(200);

        await (new EuropeanaRecordApi).find(ids, { profile: 'minimal' });

        expect(nock.isDone()).toBe(true);
      });

      it('searches the Record API for specified item URIs', async() => {
        const uris = ['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def'];
        nock(EuropeanaRecordApi.BASE_URL)
          .get('/search.json')
          .query(query => {
            return !query.profile &&
              !query.qf &&
              query.query === 'europeana_id:("/123/abc" OR "/123/def")';
          })
          .reply(200);

        await (new EuropeanaRecordApi).find(uris);

        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
