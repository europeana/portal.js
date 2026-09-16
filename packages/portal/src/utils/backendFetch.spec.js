import isEqual from 'lodash/isEqual.js';
import nock from 'nock';
import sinon from 'sinon';

import { backendFetch } from './backendFetch.js';

import * as cacheBackendServerMiddlewareModule from '@/server-middleware/api/cache/index.js';
import * as collectionsBackendServerMiddlewareModule from '@/server-middleware/api/collections/index.js';
import * as retrieveCollectionsBackendServerMiddlewareModule from '@/server-middleware/api/collections/retrieve.js';

describe('@/utils/backendFetch.js', () => {
  const clientSide = () => {
    process.client = true;
    process.server = false;
  };
  const serverSide = () => {
    process.client = false;
    process.server = true;
  };

  const baseUrl = 'https://example.org';

  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
    delete process.client;
    delete process.server;
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('backendFetch', () => {
    describe('backend: cache', () => {
      const id = 'cache';
      const keys = ['items/featured', 'matomo/visits'];
      const response = { 'items/featured': ['/123/abc'], 'matomo/visits': 4000 };

      describe('server-side', () => {
        beforeEach(() => {
          serverSide();
        });

        it('fetches cached content for supplied keys from server middleware module fn', async() => {
          const context = { $config: { redis: {} } };
          const fn = sinon.stub(cacheBackendServerMiddlewareModule, 'cached').resolves(response);

          const fetched = await backendFetch(id, [keys], context);

          expect(fn.calledWith(['items/featured', 'matomo/visits'], {})).toBe(true);
          expect(fetched).toEqual(response);
        });
      });

      describe('client-side', () => {
        beforeEach(() => {
          clientSide();
        });

        it('fetches cached content for supplied keys from /_api/cache', async() => {
          const context = { $config: { app: { baseUrl } } };

          nock(baseUrl)
            .get('/_api/cache')
            .query((query) => isEqual(query.id, keys))
            .reply(200, response);

          const fetched = await backendFetch(id, [keys], context);

          expect(nock.isDone()).toBe(true);
          expect(fetched).toEqual(response);
        });
      });
    });

    describe('backend: collections', () => {
      const id = 'collections';
      const type = 'organisations/aggregators';
      const params = {
        page: '2',
        query: 'museum'
      };
      const response = { items: [{ id: 'http://data.example.org/organization/1' }] };

      describe('server-side', () => {
        beforeEach(() => {
          serverSide();
        });

        it('fetches cached content for supplied keys from server middleware module fn', async() => {
          const context = { $config: { redis: {} } };
          const fn = sinon.stub(collectionsBackendServerMiddlewareModule, 'fetchData').resolves(response);

          const fetched = await backendFetch(id, [type, params], context);

          expect(fn.calledWith('organisations/aggregators', { page: '2', query: 'museum' }, {})).toBe(true);
          expect(fetched).toEqual(response);
        });
      });

      describe('client-side', () => {
        beforeEach(() => {
          clientSide();
        });

        it('fetches collections content for supplied type and params from /_api/collections/${type}', async() => {
          const context = { $config: { app: { baseUrl } } };
          nock(baseUrl)
            .get('/_api/collections/organisations/aggregators')
            .query((query) => isEqual(query, params))
            .reply(200, response);

          const fetched = await backendFetch(id, [type, params], context);

          expect(nock.isDone()).toBe(true);
          expect(fetched).toEqual(response);
        });
      });
    });

    describe('backend: collections/retrieve', () => {
      const id = 'collections/retrieve';
      const entityIds = [
        'http://data.example.org/organization/1',
        'http://data.example.org/organization/2'
      ];
      const options = {
        fields: 'prefLabel'
      };
      const response = { items: [
        { prefLabel: { en: 'One' } },
        { prefLabel: { en: 'Two' } }
      ] };

      describe('server-side', () => {
        beforeEach(() => {
          serverSide();
        });

        it('fetches cached content for supplied keys from server middleware module fn', async() => {
          const context = { $config: {} };
          const fn = sinon.stub(retrieveCollectionsBackendServerMiddlewareModule, 'fetchData').resolves(response);

          const fetched = await backendFetch(id, [entityIds, options], context);

          expect(fn.called).toBe(true);
          expect(fetched).toEqual(response);
        });
      });

      describe('client-side', () => {
        beforeEach(() => {
          clientSide();
        });

        it('fetches collections content for supplied type and params from /_api/collections/${type}', async() => {
          const context = { $config: { app: { baseUrl } } };
          nock(baseUrl)
            .post('/_api/collections/retrieve', entityIds)
            .query((query) => isEqual(query, options))
            .reply(200, response);

          const fetched = await backendFetch(id, [entityIds, options], context);

          expect(nock.isDone()).toBe(true);
          expect(fetched).toEqual(response);
        });
      });
    });
  });
});
