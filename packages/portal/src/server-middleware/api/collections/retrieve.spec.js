import sinon from 'sinon';

import serverMiddleware, { fetchData } from './retrieve.js';

describe('server-middleware/api/collections/retrieve.js', () => {
  const context = { $apis: { entity: { retrieve: sinon.stub().resolves({}) } } };
  const ids = [
    'http://data.europeana.eu/organization/1',
    'http://data.europeana.eu/organization/2'
  ];

  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
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
    it('retrieves from the Entity API, with IDs from arg', async() => {
      await fetchData(ids, context);

      expect(context.$apis.entity.retrieve.calledWith(ids)).toBe(true);
    });
  });
});
