import nock from 'nock';

const cacher = require('@/cachers/galleries/recent');

const setApiResponse = { items: [
  { id: '001',
    title: { en: 'gallery 001' } }
] };

const config = {
  europeana: {
    apis: {
      set: {
        url: 'https://api.example.org/set',
        key: 'setApiKey'
      }
    }
  }
};

const localeCodes = ['en'];

describe('cachers/galleries/recent', () => {
  beforeEach(() => {
    nock(config.europeana.apis.set.url)
      .get('/search.json')
      .query(query => (
        query.query === 'visibility:published' && query.profile === 'itemDescriptions'
        && query.qf === 'lang:en'
      ))
      .reply(200, setApiResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('queries Set API for 4 galleries', async() => {
      await cacher.data(config, localeCodes);

      expect(nock.isDone()).toBe(true);
    });

    it('returns item metadata to cache', async() => {
      const data = await cacher.data(config, localeCodes);

      expect(data.en).toEqual(setApiResponse.items);
    });
  });
});
