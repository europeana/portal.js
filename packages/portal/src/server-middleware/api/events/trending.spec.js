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
const expressNextStub = sinon.spy();

describe('@/server-middleware/api/events/trending', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  it('queries postgres for trending items', async() => {
    await trendingEventsHandler(expressReqStub, expressResStub, expressNextStub);

    expect(pgPoolQuery.called).toBe(true);
  });

  it('responds with items as json', async() => {
    await trendingEventsHandler(expressReqStub, expressResStub, expressNextStub);

    expect(expressResStub.json.calledWith({ items: fixtures.rows })).toBe(true);
  });
});
