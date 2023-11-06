import pg from 'pg';
import sinon from 'sinon';

import trendingEventsHandler from '@/server-middleware/api/events/trending';

const fixtures = {
  rows: ['item1', 'item2']
};

const pgPoolQuery = sinon.stub().resolves({ rows: fixtures.rows });

const expressReqStub = {};
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/events/trending', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when not explicitly enabled', () => {
    const options = {};

    it('does not query postgres', async() => {
      await trendingEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.called).toBe(false);
    });

    it('responds with empty items array as json', async() => {
      await trendingEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ items: [] })).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    it('queries postgres for trending items', async() => {
      await trendingEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.called).toBe(true);
    });

    it('responds with items as json', async() => {
      await trendingEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ items: fixtures.rows })).toBe(true);
    });
  });
});
