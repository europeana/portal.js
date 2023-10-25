import pg from 'pg';
import sinon from 'sinon';

import trendingEventsMiddleware from '@/server-middleware/api/events/trending';

const fixtures = {
  rows: ['item1', 'item2']
};

const pgClientConnect = sinon.stub();
const pgClientOn = sinon.stub();
const pgClientQuery = sinon.stub().resolves({ rows: fixtures.rows });

const expressReqStub = {};
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/events/trending', () => {
  beforeAll(() => {
    sinon.replace(pg.Client.prototype, 'connect', pgClientConnect);
    sinon.replace(pg.Client.prototype, 'on', pgClientOn);
    sinon.replace(pg.Client.prototype, 'query', pgClientQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when not explicitly enabled', () => {
    const options = {};

    it('does not connect to postgres', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(pgClientConnect.called).toBe(false);
    });

    it('responds with empty items array as json', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ items: [] })).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    it('connects to postgres', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(pgClientConnect.called).toBe(true);
    });

    it('registers postgres error handler', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(pgClientOn.calledWith('error', sinon.match.func)).toBe(true);
    });

    it('queries postgres for trending items', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(pgClientQuery.called).toBe(true);
    });

    it('responds with items as json', async() => {
      await trendingEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(expressResStub.json.calledWith({ items: fixtures.rows })).toBe(true);
    });
  });
});
