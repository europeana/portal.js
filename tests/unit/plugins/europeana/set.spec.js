import nock from 'nock';

import set from '../../../../plugins/europeana/set';
import config from '../../../../modules/apis/defaults';
const apiUrl = `${config.set.origin}${config.set.path}`;

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const setId = '1234';
const itemId = '123/abc';

const likesResponse =
  {
    '@context': 'http://www.europeana.eu/schemas/context/collection.jsonld',
    id: 'http://data.europeana.eu/set/1234',
    type: 'BookmarkFolder',
    title: {
      en: 'LIKES'
    }
  };

const searchResponse =
  {
    items: [
      'http://data.europeana.eu/set/163'
    ]
  };

describe('describe /plugins/europeana/set', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('getLikes()', () => {
    it('get the likes set', async() => {
      nock(apiUrl)
        .get('/search?query=creator:auth-user-sub+type:BookmarkFolder')
        .reply(200,  searchResponse);

      const response =  await set(axios).getLikes('auth-user-sub');
      response.should.eq('163');
    }
    );
  }),
  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(apiUrl)
        .post('/')
        .reply(200,  likesResponse);

      const response =  await set(axios).createLikes();
      response.id.should.eq('http://data.europeana.eu/set/1234');
    }
    );
  }),
  describe('modifyItems()', () => {
    it('adds item to set', async() => {
      nock(apiUrl)
        .put('/' + setId + '/' + itemId)
        .reply(200,  likesResponse);

      const response =  await set(axios).modifyItems('add', setId, itemId);
      response.id.should.eq('http://data.europeana.eu/set/1234');
    }
    );
  });
});
