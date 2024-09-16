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
const expressNextStub = sinon.spy();

describe('@/server-middleware/api/events/views', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  it('queries postgres for the views', async() => {
    await viewsEventsHandler(expressReqStub, expressResStub, expressNextStub);

    expect(pgPoolQuery.calledWith(
      sinon.match((sql) => sql.trim().startsWith('SELECT ')),
      ['https://example.com/example', 'https://example.com/example']
    )).toBe(true);
  });

  it('responds with the view count as json', async() => {
    await viewsEventsHandler(expressReqStub, expressResStub, expressNextStub);

    expect(expressResStub.json.calledWith({ viewCount: 128 })).toBe(true);
  });
});
