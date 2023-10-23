import pg from 'pg';
import sinon from 'sinon';

import logEventsMiddleware from '@/server-middleware/api/events/log';

const fixtures = {
  db: {
    objectId: 2,
    sessionId: 1
  },
  reqBody: {
    actionType: 'like',
    objectUri: 'http://data.europeana.eu/item/123/abc',
    sessionId: 'uuid'
  }
};

const pgClientConnect = sinon.stub();
const pgClientOn = sinon.stub();
const pgClientQuery = sinon.stub();
pgClientQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM events.objects ')),
  [fixtures.reqBody.objectUri]
)
  .resolves({ rowCount: 0 });
pgClientQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO events.objects ')),
  [fixtures.reqBody.objectUri]
)
  .resolves({ rows: [{ id: fixtures.db.objectId }] });
pgClientQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM events.sessions ')),
  [fixtures.reqBody.sessionId]
)
  .resolves({ rowCount: 0 });
pgClientQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO events.sessions ')),
  [fixtures.reqBody.sessionId]
)
  .resolves({ rows: [{ id: fixtures.db.sessionId }] });
pgClientQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('SELECT a.id FROM events.actions a LEFT JOIN events.action_types at')),
  [fixtures.db.objectId, fixtures.reqBody.actionType, fixtures.db.sessionId]
)
  .resolves({ rowCount: 0 });
pgClientQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('INSERT INTO events.actions ')),
  [fixtures.db.objectId, fixtures.db.sessionId, fixtures.reqBody.actionType]
)
  .resolves({});

const expressReqStub = {
  body: fixtures.reqBody,
  get: sinon.spy()
};
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/events/log', () => {
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
      await logEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(pgClientConnect.called).toBe(false);
    });

    it('responds with 204 status', async() => {
      await logEventsMiddleware(options)(expressReqStub, expressResStub);

      expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    describe('and user agent is a known bot', () => {
      const expressReqStub = {
        get: sinon.stub().withArgs('user-agent').returns('search engine bot')
      };

      it('does not connect to postgres', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(pgClientConnect.called).toBe(false);
      });

      it('responds with 204 status', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
      });
    });

    describe('and user agent is not a known bot', () => {
      const expressReqStub = {
        body: fixtures.reqBody,
        get: sinon.spy()
      };
      it('connects to postgres', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(pgClientConnect.called).toBe(true);
      });

      it('registers postgres error handler', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(pgClientOn.calledWith('error', sinon.match.func)).toBe(true);
      });

      it('runs all postgres queries to log event', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(pgClientQuery.getCalls().length).toBe(6);
      });

      it('responds with 204 status', async() => {
        await logEventsMiddleware(options)(expressReqStub, expressResStub);

        expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
      });
    });
  });
});
