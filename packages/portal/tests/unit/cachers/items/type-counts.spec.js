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

describe('cachers/items/type-counts', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
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

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('.data', () => {
    it('queries Record API for facets', async() => {
      await cacher.data();

      expect(nock.isDone()).toBe(true);
    });

    it('returns count metadata', async() => {
      const data = await cacher.data();

      expect(data).toEqual(dataToCache);
    });
  });
});
