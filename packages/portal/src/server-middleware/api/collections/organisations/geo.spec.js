import sinon from 'sinon';

import serverMiddleware, { fetchData } from './geo.js';
import * as cacheMiddleware from '@/server-middleware/api/cache/index.js';

const cachedData = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'id': 'http://data.europeana.eu/organization/1',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          18.2924425,
          57.6396512
        ]
      }
    }
  ]
};
const cacheKey = 'collections:organisations:geo';

describe('server-middleware/api/collections/geo.js', () => {
  beforeAll(() => {
    sinon.stub(cacheMiddleware, 'cached').resolves({ [cacheKey]: cachedData });
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    sinon.restore();
  });

  describe('default export (middleware)', () => {
    const req = {};
    const resStub = {
      json: sinon.stub()
    };
    const nextStub = sinon.stub().callsFake((err) => {
      if (err instanceof Error) {
        throw err;
      }
    });

    it('fetches from the cache', async() => {
      await serverMiddleware()(req, resStub, nextStub);

      expect(cacheMiddleware.cached.calledWith(cacheKey, {})).toBe(true);
    });

    it('responds with JSON', async() => {
      await serverMiddleware()(req, resStub, nextStub);

      expect(resStub.json.called).toBe(true);
    });
  });

  describe('fetchData', () => {
    it('fetches from the cache', async() => {
      await fetchData();

      expect(cacheMiddleware.cached.calledWith(cacheKey, {})).toBe(true);
    });
  });
});
