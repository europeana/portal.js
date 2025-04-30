import nock from 'nock';
import sinon from 'sinon';

import EuropeanaSetApi from '@/plugins/europeana/set';

const setId = '1234';
const itemId = '/123/abc';
const itemIds = ['/123/abc', '/123/def'];
const apiKey = 'apikey';
const $config = { europeana: { apis: { set: { key: apiKey } } } };
const likesResponse = {
  '@context': 'http://www.europeana.eu/schemas/context/collection.jsonld',
  id: 'http://data.europeana.eu/set/1234',
  type: 'BookmarkFolder',
  title: {
    en: 'LIKES'
  }
};

describe('@/plugins/europeana/set', () => {
  afterEach(() => {
    nock.cleanAll();
    sinon.resetHistory();
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

      const response = await (new EuropeanaSetApi({ $config })).get(setId);
      expect(response.items).toEqual(['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def']);
    });

    it('includes the axios default params', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query(query => query.wskey === apiKey)
        .reply(200, setGetResponse);

      await (new EuropeanaSetApi({ $config })).get(setId);
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
        .query({ profile: 'items', query: 'creator:auth-user-sub type:BookmarkFolder', wskey: 'apikey' })
        .reply(200, searchResponse);

      const response = await (new EuropeanaSetApi({ $config })).getLikes('auth-user-sub');
      expect(response).toBe('http://data.europeana.eu/set/163');
    });
  });

  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .post('/')
        .query(true)
        .reply(200, likesResponse);

      const response = await (new EuropeanaSetApi({ $config })).createLikes();
      expect(response.id).toBe('http://data.europeana.eu/set/1234');
    });
  });

  describe('delete()', () => {
    it('deletes the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .delete(`/${setId}`)
        .query(true)
        .reply(204);

      await (new EuropeanaSetApi({ $config })).delete(setId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('create()', () => {
    const body = { type: 'Collection', collectionType: 'Gallery', visibility: 'public' };
    it('creates the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .post('/', body)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config })).create(body);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('update()', () => {
    const body = { type: 'Collection', collectionType: 'Gallery', visibility: 'public' };
    it('updates the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}`, body)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config })).update(setId, body);

      expect(nock.isDone()).toBe(true);
    });

    it('includes params if supplied', async() => {
      const params = { profile: 'standard' };
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}`, body)
        .query(query => query.profile === params.profile)
        .reply(200);

      await (new EuropeanaSetApi({ $config })).update(setId, body, params);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('publish()', () => {
    it('publishes the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/publish`)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config })).publish(setId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('unpublish()', () => {
    it('unpublishes the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/unpublish`)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config })).unpublish(setId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('search()', () => {
    it('queries the Set API for sets matching the params', async() => {
      const searchParams = {
        query: 'type:EntityBestItemsSet',
        profile: 'minimal',
        page: 1,
        pageSize: 1
      };
      nock(EuropeanaSetApi.BASE_URL)
        .get('/search')
        .query({ wskey: apiKey, ...searchParams })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).search(searchParams);

      expect(nock.isDone()).toBe(true);
    });

    describe('getItems', () => {
      it('gets the items within a set', async() => {
        const items = ['item1', 'item2'];
        nock(EuropeanaSetApi.BASE_URL)
          .get(`/${setId}`)
          .query({ page: 1, pageSize: 100, profile: 'items.meta', wskey: 'apikey' })
          .reply(200, { items });

        const response = await (new EuropeanaSetApi({ $config })).getItems(setId);

        expect(nock.isDone()).toBe(true);
        expect(response).toEqual(items);
      });

      describe('when the response indicates invalid page param', () => {
        it('returns an empty array', async() => {
          nock(EuropeanaSetApi.BASE_URL)
            .get(`/${setId}`)
            .query({ page: 2, pageSize: 100, profile: 'items.meta', wskey: 'apikey' })
            .reply(400, { message: 'Invalid property value. page : value out of range: 2, last page:1' });

          const response = await (new EuropeanaSetApi({ $config })).getItems(setId, { page: 2 });

          expect(nock.isDone()).toBe(true);
          expect(response).toEqual([]);
        });
      });
    });
  });

  describe('insertItems', () => {
    it('inserts the items into the set at the given position', async() => {
      const position = 7;
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/items`, itemIds)
        .query({ position, wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).insertItems(setId, itemIds, position);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('pinItem', () => {
    it('inserts the item into the set at the "pin" position', async() => {
      const position = 'pin';
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/items`, [itemId])
        .query({ position, wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).pinItem(setId, itemId);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('deleteItems', () => {
    it('deletes the item from the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .delete(`/${setId}/items`, itemIds)
        .query({ wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).deleteItems(setId, itemIds);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('repositionItem', () => {
    const position = 7;

    it('deletes then reinserts the item at the new position', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .delete(`/${setId}/items`, [itemId])
        .query({ wskey: apiKey })
        .reply(200);
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/items`, [itemId])
        .query({ position, wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).repositionItem(setId, itemId, position);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('searchItems', () => {
    it('searches for item(s) within a set', async() => {
      const itemIds = ['/123/abc', '/123/def'];
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}/search`)
        .query({ profile: 'items', query: '*', qf: ['item:/123/abc', 'item:/123/def'], wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).searchItems(setId, itemIds);

      expect(nock.isDone()).toBe(true);
    });
  });
});
