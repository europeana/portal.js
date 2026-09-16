import sinon from 'sinon';

import serverMiddleware, { fetchData } from './index.js';
import * as cacheMiddleware from '@/server-middleware/api/cache/index.js';

const cachedData = [
  {
    id: 'http://data.europeana.eu/organization/001',
    slug: '001-museum',
    prefLabel: { es: 'Museo' },
    altLabel: { en: 'Museum' },
    countryPrefLabel: 'Spain',
    recordCount: 100
  },
  {
    id: 'http://data.europeana.eu/organization/002',
    slug: '002-library',
    prefLabel: { nl: 'Bibliotheek' },
    altLabel: { en: 'Library' },
    countryPrefLabel: 'Nederland',
    recordCount: 200
  }
];
const cacheKey = 'en:collections:organisations';
const type = 'organisations';
const query = { lang: 'en' };

describe('server-middleware/api/collections/index', () => {
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
    const req = { params: [type], query };
    const resStub = {
      json: sinon.stub()
    };
    const nextStub = sinon.stub().callsFake((err) => {
      if (err instanceof Error) {
        throw err;
      }
    });

    it('fetches from the cache, with type and locale from request', async() => {
      await serverMiddleware()(req, resStub, nextStub);

      expect(cacheMiddleware.cached.calledWith(cacheKey, {})).toBe(true);
    });

    it('responds with JSON', async() => {
      await serverMiddleware()(req, resStub, nextStub);

      expect(resStub.json.called).toBe(true);
    });
  });

  describe('fetchData', () => {
    it('fetches from the cache, with type and locale from args', async() => {
      await fetchData(type, query);

      expect(cacheMiddleware.cached.calledWith(cacheKey, {})).toBe(true);
    });

    describe('filtering', () => {
      it('filters on the query against prefLabel', async() => {
        const data = await fetchData(type, { ...query, query: 'museo' });

        expect(data.total).toBe(1);
        expect(data.items.length).toBe(1);
        expect(data.items[0].id).toBe(cachedData[0].id);
      });

      it('filters on the query against altLabel', async() => {
        const data = await fetchData(type, { ...query, query: 'museum' });

        expect(data.total).toBe(1);
        expect(data.items.length).toBe(1);
        expect(data.items[0].id).toBe(cachedData[0].id);
      });
    });

    describe('sorting', () => {
      it('sorts by prefLabel, ascending by default', async() => {
        const data = await fetchData(type, { ...query });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[1].id);
        expect(data.items[1].id).toBe(cachedData[0].id);
      });

      it('can sort by literal string field, ascending', async() => {
        const data = await fetchData(type, { ...query, sort: 'countryPrefLabel asc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[1].id);
        expect(data.items[1].id).toBe(cachedData[0].id);
      });

      it('can sort by literal string field, descending', async() => {
        const data = await fetchData(type, { ...query, sort: 'countryPrefLabel desc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[0].id);
        expect(data.items[1].id).toBe(cachedData[1].id);
      });

      it('can sort by lang map string field, ascending', async() => {
        const data = await fetchData(type, { ...query, sort: 'altLabel asc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[1].id);
        expect(data.items[1].id).toBe(cachedData[0].id);
      });

      it('can sort by lang map string field, descending', async() => {
        const data = await fetchData(type, { ...query, sort: 'altLabel desc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[0].id);
        expect(data.items[1].id).toBe(cachedData[1].id);
      });

      it('can sort by literal number field, ascending', async() => {
        const data = await fetchData(type, { ...query, sort: 'recordCount asc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[0].id);
        expect(data.items[1].id).toBe(cachedData[1].id);
      });

      it('can sort by literal number field, descending', async() => {
        const data = await fetchData(type, { ...query, sort: 'recordCount desc' });

        expect(data.total).toBe(2);
        expect(data.items.length).toBe(2);
        expect(data.items[0].id).toBe(cachedData[1].id);
        expect(data.items[1].id).toBe(cachedData[0].id);
      });
    });

    describe('pagination', () => {
      it('paginates by pageSize and page query params', async() => {
        const page1Data = await fetchData(type, { ...query, sort: 'id asc', pageSize: 1, page: 1 });

        expect(page1Data.total).toBe(2);
        expect(page1Data.items.length).toBe(1);
        expect(page1Data.items[0].id).toBe(cachedData[0].id);

        const page2Data = await fetchData(type, { ...query, sort: 'id asc', pageSize: 1, page: 2 });

        expect(page2Data.total).toBe(2);
        expect(page2Data.items.length).toBe(1);
        expect(page2Data.items[0].id).toBe(cachedData[1].id);
      });
    });
  });
});
