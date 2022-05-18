import nock from 'nock';
import sinon from 'sinon';

import plugin, { BASE_URL } from '@/plugins/europeana/set';
import { BASE_URL as RECORD_BASE_URL } from '@/plugins/europeana/record';

const setId = '1234';
const itemId = '/123/abc';
const $config = { europeana: { apis: { set: { key: 'apikey' } } } };
const likesResponse = {
  '@context': 'http://www.europeana.eu/schemas/context/collection.jsonld',
  id: 'http://data.europeana.eu/set/1234',
  type: 'BookmarkFolder',
  title: {
    en: 'LIKES'
  }
};

const searchResponse = {
  items: [
    'http://data.europeana.eu/set/163'
  ]
};

const setsResponse = [
  {
    id: 'http://data.europeana.eu/set/1',
    type: 'Collection',
    title: {
      en: 'set 1'
    },
    items: [
      'item-1',
      'item-2'
    ],
    visibility: 'private'
  },
  {
    id: 'http://data.europeana.eu/set/2',
    type: 'Collection',
    title: {
      en: 'set 2'
    },
    visibility: 'public'
  },
  {
    id: 'http://data.europeana.eu/set/3',
    type: 'Collection',
    title: {
      en: 'set 3'
    },
    visibility: 'public'
  }
];

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
    const recordSearchResponse = {
      items: [
        { id: '/123/abc', prefLabel: { en: ['ABC'] } }
      ]
    };

    it('gets the set data', async() => {
      nock(BASE_URL)
        .get(`/${setId}`)
        .query(true)
        .reply(200, setGetResponse);

      const response = await plugin({ $config }).get(setId);
      expect(response.items).toEqual(['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def']);
    });

    it('includes the axios default params', async() => {
      nock(BASE_URL)
        .get(`/${setId}`)
        .query(query => query.wskey === 'apikey')
        .reply(200, setGetResponse);

      await plugin({ $config }).get(setId);
      expect(nock.isDone()).toBe(true);
    });

    describe('options', () => {
      describe('withMinimalItems', () => {
        const context = {
          $config,
          i18n: { locale: 'nl', t: key => key },
          $apis: { record: { find: sinon.stub().resolves(recordSearchResponse) } }
        };
        beforeEach(() => {
          nock(BASE_URL)
            .get(`/${setId}`)
            .query(true)
            .reply(200, setGetResponse);
        });

        describe('when set to `true`', () => {
          const options = { withMinimalItems: true };

          it('requests 100 minimal profile items from the Record API', async() => {
            await plugin(context).get(setId, {}, options);

            expect(context.$apis.record.find.calledWith(setGetResponse.items, {
              profile: 'minimal',
              rows: 100
            })).toBe(true);
          });

          it('stores the found items on the set', async() => {
            const set = await plugin(context).get(setId, {}, options);

            expect(set.items[0]).toEqual(recordSearchResponse.items[0]);
          });

          it('stores a dcTitleLangAware warning for items not found', async() => {
            const set = await plugin(context).get(setId, {}, options);

            expect(set.items[1]).toEqual({
              id: '/123/def',
              dcTitleLangAware: { nl: ['record.status.unpublished'] }
            });
          });
        });

        describe('when set to `false` (by default)', () => {
          const options = {};

          it('does not request items from the Record API', async() => {
            await plugin(context).get(setId, {}, options);

            expect(context.$apis.record.find.called).toBe(false);
          });

          it('leaves the item URIs on the set', async() => {
            const set = await plugin(context).get(setId, {}, options);

            expect(set.items).toEqual(setGetResponse.items);
          });
        });
      });
    });
  });

  describe('getLikes()', () => {
    it('get the likes set ID', async() => {
      nock(BASE_URL)
        .get('/search')
        .query(query => query.query === 'creator:auth-user-sub type:BookmarkFolder')
        .reply(200, searchResponse);

      const response = await plugin({ $config }).getLikes('auth-user-sub');
      expect(response).toBe('http://data.europeana.eu/set/163');
    });
  });

  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(BASE_URL)
        .post('/')
        .query(true)
        .reply(200, likesResponse);

      const response = await plugin({ $config }).createLikes();
      expect(response.id).toBe('http://data.europeana.eu/set/1234');
    });
  });

  describe('modifyItems()', () => {
    it('adds item to set', async() => {
      nock(BASE_URL)
        .put(`/${setId}${itemId}`)
        .query(true)
        .reply(200, likesResponse);
      const response =  await plugin({ $config }).modifyItems('add', setId, itemId);
      expect(response.id).toBe('http://data.europeana.eu/set/1234');
    });
  });

  describe('deleteSet()', () => {
    it('deletes item from set', async() => {
      nock(BASE_URL)
        .delete(`/${setId}`)
        .query(true)
        .reply(204);

      await plugin({ $config }).deleteSet(setId);
      expect(nock.isDone()).toBe(true);
    });
  });
});
