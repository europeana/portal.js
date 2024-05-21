import nock from 'nock';
import sinon from 'sinon';

import EuropeanaSetApi from '@/set.js';

const setId = '1234';
const itemId = '/123/abc';
const config = { key: 'apikey' };
const likesResponse = {
  '@context': 'http://www.europeana.eu/schemas/context/collection.jsonld',
  id: 'http://data.europeana.eu/set/1234',
  type: 'BookmarkFolder',
  title: {
    en: 'LIKES'
  }
};

describe('@/set.js', () => {
  describe('EuropeanaSetApi', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(() => {
      nock.cleanAll();
      sinon.resetHistory();
    });

    afterAll(() => {
      nock.enableNetConnect();
    });

    describe('get()', () => {
      const setId = '1';
      const setGetResponse = {
        id: 'http://data.europeana.eu/set/1',
        type: 'Collection',
        items: [
          'http://data.europeana.eu/item/123/abc',
          'http://data.europeana.eu/item/123/def'
        ]
      };

      it('gets the set data', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .get(`/${setId}`)
          .query(true)
          .reply(200, setGetResponse);

        const response = await (new EuropeanaSetApi(config)).get(setId);
        expect(response.items).toEqual(['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def']);
      });

      it('includes the axios default params', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .get(`/${setId}`)
          .query(query => query.wskey === 'apikey')
          .reply(200, setGetResponse);

        await (new EuropeanaSetApi(config)).get(setId);
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('getLikes()', () => {
      it('get the likes set ID', async() => {
        const searchResponse = {
          items: [
            'http://data.europeana.eu/set/163'
          ]
        };
        nock(EuropeanaSetApi.BASE_URL)
          .get('/search')
          .query(query => query.query === 'creator:auth-user-sub type:BookmarkFolder')
          .reply(200, searchResponse);

        const response = await (new EuropeanaSetApi(config)).getLikes('auth-user-sub');
        expect(response).toBe('http://data.europeana.eu/set/163');
      });
    });

    describe('createLikes()', () => {
      it('creates a likes set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .post('/')
          .query(true)
          .reply(200, likesResponse);

        const response = await (new EuropeanaSetApi(config)).createLikes();
        expect(response.id).toBe('http://data.europeana.eu/set/1234');
      });
    });

    describe('modifyItems()', () => {
      it('adds item to set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}${itemId}`)
          .query(true)
          .reply(200, likesResponse);
        const response =  await (new EuropeanaSetApi(config)).modifyItems('add', setId, itemId);
        expect(response.id).toBe('http://data.europeana.eu/set/1234');
      });
    });

    describe('delete()', () => {
      it('deletes item from set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .delete(`/${setId}`)
          .query(true)
          .reply(204);

        await (new EuropeanaSetApi(config)).delete(setId);
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('update()', () => {
      it('updates the set', async() => {
        const body = { type: 'Collection', visibility: 'public' };
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}`, body)
          .query(true)
          .reply(200);

        await (new EuropeanaSetApi(config)).update(setId, body);
        expect(nock.isDone()).toBe(true);
      });

      it('includes params if supplied', async() => {
        const body = { type: 'Collection', visibility: 'public' };
        const params = { profile: 'standard' };
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}`, body)
          .query(query => query.profile === params.profile)
          .reply(200);

        await (new EuropeanaSetApi(config)).update(setId, body, params);
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('publish()', () => {
      it('publishes the set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}/publish`)
          .query(true)
          .reply(200);

        await (new EuropeanaSetApi(config)).publish(setId);
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('unpublish()', () => {
      it('unpublishes the set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}/unpublish`)
          .query(true)
          .reply(200);

        await (new EuropeanaSetApi(config)).unpublish(setId);
        expect(nock.isDone()).toBe(true);
      });
    });

    describe('search()', () => {
      it('queries the Set API for sets matching the params', async() => {
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          pageSize: 1
        };

        nock(EuropeanaSetApi.BASE_URL)
          .get('/search')
          // TODO: Expect the params, this isn't matching the request though.
          // .query({ params: { wskey: 'apikey', ...searchParams } })
          .query(true)
          .reply(200, 'response');

        const response = await (new EuropeanaSetApi(config)).search(searchParams);

        expect(response).toEqual('response');
      });
    });
  });
});
