import isEqual from 'lodash/isEqual.js';
import nock from 'nock';
import sinon from 'sinon';

import { backendFetch } from './backendFetch.js';

describe('@/utils/backendFetch.js', () => {
  const clientSide = () => {
    process.client = true;
    process.server = false;
  };
  // TODO: spec server-side module imports
  // const serverSide = () => {
  //   process.client = false;
  //   process.server = true;
  // };

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

      describe('client-side', () => {
        beforeEach(() => {
          clientSide();
        });

        it('fetches cached content for supplied keys from /_api/cache', async() => {
          const context = { $config: { app: { baseUrl } } };
          const keys = ['items/featured', 'matomo/visits'];
          const response = { 'items/featured': ['/123/abc'], 'matomo/visits': 4000 };
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

      describe('client-side', () => {
        beforeEach(() => {
          clientSide();
        });

        it('fetches collections content for supplied type and params from /_api/collections/${type}', async() => {
          const context = { $config: { app: { baseUrl } } };
          const type = 'organisations/aggregators';
          const params = {
            page: '2',
            query: 'museum'
          };
          const response = { items: [{ id: 'http://data.example.org/organization/1' }] };
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
  });
});
