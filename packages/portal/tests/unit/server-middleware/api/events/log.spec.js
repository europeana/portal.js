import pg from 'pg';
import sinon from 'sinon';

import logEventsHandler from '@/server-middleware/api/events/log';

const fixtures = {
  db: {
    objectId: 2,
    sessionId: 1,
    uri: 'http://data.europeana.eu/item/123/abc'
  },
  reqBody: {
    actionType: 'like',
    objectUri: 'http://data.europeana.eu/item/123/abc?campaign=newsletter',
    sessionId: 'uuid'
  }
};

const pgPoolQuery = sinon.stub();
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM events.objects ')),
  [fixtures.db.uri]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO events.objects ')),
  [fixtures.db.uri]
)
  .resolves({ rows: [{ id: fixtures.db.objectId }] });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM events.sessions ')),
  [fixtures.reqBody.sessionId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO events.sessions ')),
  [fixtures.reqBody.sessionId]
)
  .resolves({ rows: [{ id: fixtures.db.sessionId }] });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('SELECT a.id FROM events.actions a LEFT JOIN events.action_types at')),
  [fixtures.db.objectId, fixtures.reqBody.actionType, fixtures.db.sessionId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('INSERT INTO events.actions ')),
  [fixtures.db.objectId, fixtures.db.sessionId, fixtures.reqBody.actionType]
)
  .resolves({});

const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};
const expressNextStub = sinon.spy();

describe('@/server-middleware/api/events/log', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when user agent is a known bot', () => {
    const expressReqStub = {
      get: sinon.stub().withArgs('user-agent').returns('search engine bot')
    };

    it('does not query postgres', async() => {
      await logEventsHandler(expressReqStub, expressResStub, expressNextStub);

      expect(pgPoolQuery.called).toBe(false);
    });

    it('responds with 204 status', async() => {
      await logEventsHandler(expressReqStub, expressResStub, expressNextStub);

      expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
    });
  });

  describe('when user agent is not a known bot', () => {
    const expressReqStub = {
      body: fixtures.reqBody,
      get: sinon.spy()
    };

    it('runs all postgres queries to log event', async() => {
      await logEventsHandler(expressReqStub, expressResStub, expressNextStub);

      expect(pgPoolQuery.getCalls().length).toBe(6);
    });

    it('responds with 204 status', async() => {
      await logEventsHandler(expressReqStub, expressResStub, expressNextStub);

      expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
    });
  });
});
