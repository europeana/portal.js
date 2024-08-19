import pg from 'pg';
import sinon from 'sinon';

import votesEventsHandler from '@/server-middleware/api/polls/votes';

const fixtures = {
  db: {
    userId: 1
  },
  reqBody: {
    optionIds: ['5Ca2xEt6t10fxqMbvrw9aO', '5Ca2xEt6t10fxqMbvrw9a1', '5Ca2xEt6t10fxqMbvrw9a2'],
    userExternalId: 'keycloak_uuid'
  }
};

const pgPoolQuery = sinon.stub();
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.users ')),
  [fixtures.reqBody.userExternalId]
).resolves({ rowCount: 1, rows: [{ id: fixtures.db.userId }] });

pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('SELECT o.external_id, COUNT(*) AS total, ')),
  [fixtures.reqBody.optionIds, fixtures.db.userId]
).resolves({ rowCount: 1, rows: [{ 'id': '5Ca2xEt6t10fxqMbvrw9aO', 'total': 40, votedByCurrentUser: 1 }] });

const expressReqStub = {
  body: fixtures.reqBody,
  get: sinon.spy()
};
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/polls/votes', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when there is an external user ID', () => {
    describe('when some of the options have been voted on', () => {
      const options = { enabled: true };

      it('queries postgres for the votes', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.getCalls().length).toBe(2);
      });

      it('responds with the view count as json', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);
        expect(expressResStub.json.calledWith({ '5Ca2xEt6t10fxqMbvrw9aO': { total: 40, votedByCurrentUser: 1 } })).toBe(true);
      });
    });
  });

  describe('when there is NO external user ID', () => {
    // TODO: Add tests for anonymous retrieval
  });
});
