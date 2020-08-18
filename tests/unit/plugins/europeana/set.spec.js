import nock from 'nock';

import set from '../../../../plugins/europeana/set';
import config from '../../../../modules/apis/defaults';
const apiUrl = `${config.set.origin}${config.set.path}`;

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

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

describe('describe /plugins/europeana/set', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('getSet()', () => {
    it('get the set data', async() => {
      const setId = 1;
      const profile = 'standard';
      nock(apiUrl)
        .get('/' + setId + '?page=0&pageSize=24&profile=standard')
        .reply(200,  setsResponse[0]);

      const response =  await set(axios).getSet(setId, { profile });
      response.items.should.deep.equal(['item-1', 'item-2']);
    });
  });

  describe('getLikes()', () => {
    it('get the likes set', async() => {
      nock(apiUrl)
        .get('/search?query=creator:auth-user-sub+type:BookmarkFolder')
        .reply(200,  searchResponse);

      const response =  await set(axios).getLikes('auth-user-sub');
      response.should.eq('163');
    });
  });

  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(apiUrl)
        .post('/')
        .reply(200,  likesResponse);

      const response =  await set(axios).createLikes();
      response.id.should.eq('http://data.europeana.eu/set/1234');
    });
  });

  describe('modifyItems()', () => {
    it('adds item to set', async() => {
      nock(apiUrl)
        .put(`/${setId}${itemId}`)
        .reply(200,  likesResponse);
      const response =  await set(axios).modifyItems('add', setId, itemId);
      response.id.should.eq('http://data.europeana.eu/set/1234');
    });
  });

  describe('getSetThumbnail', () => {
    it('uses edm:preview of first item for thumbnail', () => {
      const setData = {
        items: [
          {
            edmPreview: ['http://www.example.org/image.jpg']
          }
        ]
      };

      const thumbnail = set().getSetThumbnail(setData);

      thumbnail.should.equal('http://www.example.org/image.jpg');
    });
  });
});
