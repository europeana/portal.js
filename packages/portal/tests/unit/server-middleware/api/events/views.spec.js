import pg from 'pg';
import sinon from 'sinon';

import viewsEventsHandler from '@/server-middleware/api/events/views';

const pgPoolQuery = sinon.stub().resolves({
  rows: [
    {
      'views': 128
    }
  ]
});

const expressReqStub = { query: { url: 'https://example.com/example?campaign=newsletter' } };
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/events/views', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when not explicitly enabled', () => {
    const options = {};

    it('does not query postgres', async() => {
      await viewsEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.called).toBe(false);
    });

    it('responds with viewCount 0 as json', async() => {
      await viewsEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ viewCount: 0 })).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    it('queries postgres for the views', async() => {
      await viewsEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.calledWith(
        sinon.match((sql) => sql.trim().startsWith('SELECT ')),
        ['https://example.com/example']
      )).toBe(true);
    });

    it('responds with the view count as json', async() => {
      await viewsEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ viewCount: 128 })).toBe(true);
    });
  });
});
