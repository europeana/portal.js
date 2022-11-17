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

describe('cachers/galleries/recent', () => {
  beforeEach(() => {
    nock(config.europeana.apis.set.url)
      .get('/search.json')
      .query(query => (
        query.query === 'visibility:published' && query.profile === 'itemDescriptions'
      ))
      .reply(200, setApiResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('queries Set API for 4 galleries', async() => {
      await cacher.data(config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns item metadata to cache', async() => {
      const data = await cacher.data(config);

      expect(data).toEqual(setApiResponse.items);
    });
  });
});
