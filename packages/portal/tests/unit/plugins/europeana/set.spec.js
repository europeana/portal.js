import nock from 'nock';
import sinon from 'sinon';

import EuropeanaSetApi from '@/plugins/europeana/set';

const setId = '1234';
const itemId = '/123/abc';
const apiKey = 'apikey';
const $config = { europeana: { apis: { set: { key: apiKey } } } };
const $configV1 = { europeana: { apis: { set: { key: apiKey, version: '1.0' } } } };
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

    it('removes the page & perPage params if API version is 1.0', async() => {
      const getParams = {
        page: 1,
        perPage: 100
      };
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query({ wskey: 'apikey', profile: 'standard' })
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).get(setId, getParams);

      expect(nock.isDone()).toBe(true);
    });

    it('substitutes the items.meta param if API version is 1.0', async() => {
      const getParams = {
        profile: 'items.meta',
        page: 1,
        perPage: 100
      };
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query({ wskey: 'apikey', profile: 'itemDescriptions' })
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).get(setId, getParams);

      expect(nock.isDone()).toBe(true);
    });

    it('substitutes the meta param if API version is 1.0', async() => {
      const getParams = {
        profile: 'meta'

      };
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query({ wskey: 'apikey', profile: 'standard' })
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).get(setId, getParams);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('getWithItems', () => {
    it('gets the set metadata, and items, and combines them', async() => {
      const items = ['item1', 'item2'];
      const meta = { id: 'set1' };
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query({ profile: 'meta', wskey: 'apikey' })
        .reply(200, meta);
      nock(EuropeanaSetApi.BASE_URL)
        .get(`/${setId}`)
        .query({ page: 1, pageSize: 100, profile: 'items.meta', wskey: 'apikey' })
        .reply(200, { items });

      const response = await (new EuropeanaSetApi({ $config })).getWithItems(setId);

      expect(nock.isDone()).toBe(true);
      expect(response).toEqual({ id: 'set1', items });
    });

    describe('if API version is 1.0', () => {
      it('gets the set with item descriptions', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .get(`/${setId}`)
          .query({ profile: 'itemDescriptions', wskey: 'apikey', pageSize: 100 })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).getWithItems(setId);

        expect(nock.isDone()).toBe(true);
      });
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

    it('removes collectionType data property if API version is 1.0', async() => {
      const bodyV1 = { type: 'Collection', visibility: 'public' };
      nock(EuropeanaSetApi.BASE_URL)
        .post('/', bodyV1)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).create(body);

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

    it('removes collectionType data property if API version is 1.0', async() => {
      const bodyV1 = { type: 'Collection', visibility: 'public' };
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}`, bodyV1)
        .query(true)
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).update(setId, body);

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

    describe('if API version is 1.0', () => {
      it('decrements page param', async() => {
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          page: 1,
          pageSize: 1
        };
        nock(EuropeanaSetApi.BASE_URL)
          .get('/search')
          .query({ wskey: apiKey, ...searchParams, page: 0 })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).search(searchParams);

        expect(nock.isDone()).toBe(true);
      });

      it('uses standard profile when items.meta profile and withMinimalItemPreviews option are set', async() => {
        const searchParams = {
          query: '',
          profile: 'items.meta'
        };
        nock(EuropeanaSetApi.BASE_URL)
          .get('/search')
          .query({ wskey: 'apikey', ...searchParams, profile: 'standard' })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).search(searchParams, { withMinimalItemPreviews: true });

        expect(nock.isDone()).toBe(true);
      });
    });

    it('changes param profile=items to profile=minimal if API version is 1.0', async() => {
      const searchParams = {
        query: 'type:Collection',
        profile: 'items'
      };
      nock(EuropeanaSetApi.BASE_URL)
        .get('/search')
        .query({ wskey: 'apikey', ...searchParams, profile: 'minimal' })
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).search(searchParams);

      expect(nock.isDone()).toBe(true);
    });

    it('changes param profile=items.meta to profile=itemDescritpions if API version is 1.0', async() => {
      const searchParams = {
        query: 'type:EntityBestItemsSet',
        profile: 'items.meta',
        page: 1,
        pageSize: 1
      };
      nock(EuropeanaSetApi.BASE_URL)
        .get('/search')
        .query({ wskey: 'apikey', ...searchParams, profile: 'itemDescriptions', page: 0 })
        .reply(200);

      await (new EuropeanaSetApi({ $config: $configV1 })).search(searchParams);

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
    });

    describe('options', () => {
      describe('withMinimalItemPreviews', () => {
        const recordSearchResponse = {
          items: [
            { id: '/123/abc', prefLabel: { en: ['ABC'] } }
          ]
        };
        const context = {
          $config: $configV1,
          $apis: { record: { find: sinon.stub().resolves(recordSearchResponse) } }
        };
        const setSearchResponse = {
          items: [
            {
              id: 'http://data.europeana.eu/set/1',
              items: [
                'http://data.europeana.eu/item/123/abc',
                'http://data.europeana.eu/item/123/ghi'
              ]
            },
            {
              id: 'http://data.europeana.eu/set/2',
              items: ['http://data.europeana.eu/item/123/def']
            }
          ]
        };

        beforeEach(() => {
          nock(EuropeanaSetApi.BASE_URL)
            .get('/search')
            .query(true)
            .reply(200, setSearchResponse);
        });

        describe('when set to `true`', () => {
          const options = { withMinimalItemPreviews: true };

          it('requests the minimal profile for the first item in each set from the Record API', async() => {
            await (new EuropeanaSetApi(context)).search({}, options);

            expect(context.$apis.record.find.calledWith(
              [
                'http://data.europeana.eu/item/123/abc',
                'http://data.europeana.eu/item/123/def'
              ],
              { profile: 'minimal', rows: 100 }
            )).toBe(true);
          });

          it('stores the found items on the sets', async() => {
            const response = await (new EuropeanaSetApi(context)).search({}, options);

            expect(response.items[0].items[0]).toEqual(recordSearchResponse.items[0]);
          });

          it('stores just the id for first set items not found', async() => {
            const response = await (new EuropeanaSetApi(context)).search({}, options);

            expect(response.items[1].items[0]).toEqual({
              id: '/123/def'
            });
          });

          it('stores just the id for non-first set items', async() => {
            const response = await (new EuropeanaSetApi(context)).search({}, options);

            expect(response.items[0].items[1]).toEqual({
              id: '/123/ghi'
            });
          });
        });

        describe('when set to `false` (by default)', () => {
          const options = {};

          it('does not request items from the Record API', async() => {
            await (new EuropeanaSetApi(context)).search({}, options);

            expect(context.$apis.record.find.called).toBe(false);
          });

          it('leaves the item URIs on the sets', async() => {
            const response = await (new EuropeanaSetApi(context)).search({}, options);

            expect(response.items[0].items).toEqual(setSearchResponse.items[0].items);
            expect(response.items[1].items).toEqual(setSearchResponse.items[1].items);
          });
        });
      });
    });
  });

  describe('insertItem', () => {
    it('inserts the item into the set at the given position', async() => {
      const position = 7;
      nock(EuropeanaSetApi.BASE_URL)
        .put(`/${setId}/items`, [itemId])
        .query({ position, wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).insertItem(setId, itemId, position);

      expect(nock.isDone()).toBe(true);
    });

    describe('v1.0 API compatibility', () => {
      it('inserts the item into the set at the given position', async() => {
        const position = 7;
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}${itemId}`)
          .query({ position, wskey: apiKey })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).insertItem(setId, itemId, position);

        expect(nock.isDone()).toBe(true);
      });
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

  describe('deleteItem', () => {
    it('deletes the item from the set', async() => {
      nock(EuropeanaSetApi.BASE_URL)
        .delete(`/${setId}/items`, [itemId])
        .query({ wskey: apiKey })
        .reply(200);

      await (new EuropeanaSetApi({ $config })).deleteItem(setId, itemId);

      expect(nock.isDone()).toBe(true);
    });

    describe('v1.0 API compatibility', () => {
      it('deletes the item from the set', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .delete(`/${setId}${itemId}`)
          .query({ wskey: apiKey })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).deleteItem(setId, itemId);

        expect(nock.isDone()).toBe(true);
      });
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

    describe('v1.0 API compatibility', () => {
      it('deletes then reinserts the item at the new position', async() => {
        nock(EuropeanaSetApi.BASE_URL)
          .delete(`/${setId}${itemId}`)
          .query({ wskey: apiKey })
          .reply(200);
        nock(EuropeanaSetApi.BASE_URL)
          .put(`/${setId}${itemId}`)
          .query({ position, wskey: apiKey })
          .reply(200);

        await (new EuropeanaSetApi({ $config: $configV1 })).repositionItem(setId, itemId, position);

        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
