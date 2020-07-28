import nock from 'nock';

import sets from '../../../../plugins/europeana/sets';
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
        title: {
          en: 'LIKES'
        }
      };

describe('describe /plugins/europeana/sets', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('createLikes()', () => {
    it('creates a likes set', async() => {
      nock(apiUrl)
        .post('/')
        .reply(200,  likesResponse);

      const response =  await sets(axios).createLikes();
      response.id.should.eq('http://data.europeana.eu/set/1234');
    }
    );
  }),
  describe('modifyItems()', () => {
    it('adds item to set', async() => {
      nock(apiUrl)
        .put('/' + setId + '/' + itemId)
        .reply(200,  likesResponse);

      const response =  await sets(axios).modifyItems('add', setId, itemId);
      response.id.should.eq('http://data.europeana.eu/set/1234');
    }
    );
  });
});
