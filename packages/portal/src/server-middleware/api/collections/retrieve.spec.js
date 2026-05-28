import nock from 'nock';
import sinon from 'sinon';

import serverMiddleware, { fetchData } from './retrieve.js';

describe('server-middleware/api/collections/retrieve.js', () => {
  const entities = [
    {
      id: 'http://data.europeana.eu/organization/1',
      prefLabel: { en: 'one' }
    },
    {
      id: 'http://data.europeana.eu/organization/2',
      prefLabel: { en: 'two' }
    }
  ];
  const ids = [
    'http://data.europeana.eu/organization/1',
    'http://data.europeana.eu/organization/2'
  ];
  const context = { $apis: { entity: { retrieve: sinon.stub().withArgs(ids).resolves(entities) } } };

  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('default export (middleware)', () => {
    const req = { body: ids };
    const resStub = {
      json: sinon.stub()
    };
    const nextStub = sinon.stub().callsFake((err) => {
      if (err instanceof Error) {
        throw err;
      }
    });

    it('retrieves from the Entity API, with IDs from request body', async() => {
      await serverMiddleware(context)(req, resStub, nextStub);

      expect(context.$apis.entity.retrieve.calledWith(ids)).toBe(true);
    });

    it('responds with JSON', async() => {
      await serverMiddleware(context)(req, resStub, nextStub);

      expect(resStub.json.called).toBe(true);
    });
  });

  describe('fetchData', () => {
    it('retrieves from the Entity API client, with IDs from 1st arg', async() => {
      await fetchData(ids, undefined, context);

      expect(context.$apis.entity.retrieve.calledWith(ids)).toBe(true);
    });

    it('returns the items from the API client', async() => {
      const response = await fetchData(ids, undefined, context);

      expect(response).toEqual(entities);
    });

    describe('picking fields to include in 2nd arg', () => {
      it('picks single top-level field', async() => {
        const fields = 'id';

        const response = await fetchData(ids, fields, context);

        expect(response).toEqual([{ id: response[0].id }, { id: response[1].id }]);
      });
    });
  });
});
