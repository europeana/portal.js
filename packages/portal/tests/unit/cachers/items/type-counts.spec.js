import nock from 'nock';

const cacher = require('@/cachers/items/type-counts');

const fields = [
  { label: 'IMAGE', count: 36839700 },
  { label: 'TEXT', count: 23626784 },
  { label: 'VIDEO', count: 1111932 },
  { label: 'SOUND', count: 849936 },
  { label: '3D', count: 24104 }
];

const apiResponse = {
  facets: [{
    name: 'TYPE',
    fields
  }]
};

const dataToCache = fields;

const config = {
  europeana: {
    apis: {
      record: {
        url: 'https://api.example.org/record',
        key: 'recordApiKey'
      }
    }
  }
};

describe('cachers/items/type-counts', () => {
  beforeEach(() => {
    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query((query) => (
        query.profile === 'facets' &&
        query.query === '*:*' &&
        query.facet === 'TYPE' &&
        query.qf === 'contentTier:(1 OR 2 OR 3 OR 4)' &&
        query.rows === '0'
      ))
      .reply(200, apiResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('queries Record API for facets', async() => {
      await cacher.data(config);

      expect(nock.isDone()).toBe(true);
    });

    it('returns count metadata', async() => {
      const data = await cacher.data(config);

      expect(data).toEqual(dataToCache);
    });
  });
});
