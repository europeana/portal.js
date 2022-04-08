import nock from 'nock';

import set, { BASE_URL } from '@/plugins/europeana/set';

const $config = { europeana: { apis: { set: { key: 'apikey' } } } };

const setId = '1234';
const itemId = '/123/abc';

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

describe('describe./@/plugins/europeana/set', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('get()', () => {
    it('gets the set data', async() => {
      const setId = '1';
      nock(BASE_URL)
        .get(`/${setId}`)
        .query(true)
        .reply(200, setsResponse[0]);

      const response = await set({ $config }).get(setId);
      expect(response.items).toEqual(['item-1', 'item-2']);
    });

    it('includes the axios default params', async() => {
      const setId = '1';
      nock(BASE_URL)
        .get(`/${setId}`)
        .query(query => query.wskey === 'apikey')
        .reply(200);

      await set({ $config }).get(setId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('getLikes()', () => {
    it('get the likes set ID', async() => {
      nock(BASE_URL)
        .get('/search')
        .query(query => query.query === 'creator:auth-user-sub type:BookmarkFolder')
        .reply(200, searchResponse);

      const response = await set({ $config }).getLikes('auth-user-sub');
      expect(response).toBe('http://data.europeana.eu/set/163');
    });
  });

  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(BASE_URL)
        .post('/')
        .query(true)
        .reply(200, likesResponse);

      const response = await set({ $config }).createLikes();
      expect(response.id).toBe('http://data.europeana.eu/set/1234');
    });
  });

  describe('modifyItems()', () => {
    it('adds item to set', async() => {
      nock(BASE_URL)
        .put(`/${setId}${itemId}`)
        .query(true)
        .reply(200, likesResponse);
      const response =  await set({ $config }).modifyItems('add', setId, itemId);
      expect(response.id).toBe('http://data.europeana.eu/set/1234');
    });
  });

  describe('deleteSet()', () => {
    it('deletes item from set', async() => {
      nock(BASE_URL)
        .delete(`/${setId}`)
        .query(true)
        .reply(204);

      await set({ $config }).deleteSet(setId);
      expect(nock.isDone()).toBe(true);
    });
  });
});
