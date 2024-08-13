import pg from 'pg';
import sinon from 'sinon';

import voteEventsHandler from '@/server-middleware/api/polls/vote';

const fixtures = {
  db: {
    userId: 2,
    optionId: 1
  },
  reqBody: {
    userExternalId: 'keycloak_uuid',
    optionExternalId: 'contentful_sys_id'
  }
};

const pgPoolQuery = sinon.stub();
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.users ')),
  [fixtures.reqBody.userExternalId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO polls.users ')),
  [fixtures.reqBody.userExternalId]
)
  .resolves({ rows: [{ id: fixtures.db.userId }] });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.options ')),
  [fixtures.reqBody.optionExternalId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO polls.options ')),
  [fixtures.reqBody.optionExternalId]
)
  .resolves({ rows: [{ id: fixtures.db.optionId }] });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('INSERT INTO polls.votes ')),
  [fixtures.db.userId, fixtures.db.optionId]
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

describe('@/server-middleware/api/polls/vote', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when not explicitly enabled', () => {
    const options = {};

    it('does not query postgres', async() => {
      await voteEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.called).toBe(false);
    });

    it('responds with 503 status', async() => {
      await voteEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.sendStatus.calledWith(503)).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    const expressReqStub = {
      body: fixtures.reqBody,
      get: sinon.spy()
    };

    describe('when for voting on behalf of a user with a valid session', () => {
      // TODO: authorisation
      it('runs all postgres queries to vote on the option', async() => {
        await voteEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.getCalls().length).toBe(5);
      });

      it('responds with 204 status', async() => {
        await voteEventsHandler(options)(expressReqStub, expressResStub);

        expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
      });
    });
  });
});

