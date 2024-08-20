import pg from 'pg';
import sinon from 'sinon';

import votesEventsHandler from '@/server-middleware/api/polls/votes';

const fixtures = {
  db: {
    voterId: 1
  },
  reqQuery: {
    candidate: ['feature-id-one', 'feature-id-two', 'feature-id-three'],
    voter: 'keycloak_uuid'
  }
};

const pgPoolQuery = sinon.stub();
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.voters ')),
  [fixtures.reqQuery.voter]
).resolves({ rowCount: 1, rows: [{ id: fixtures.db.voterId }] });

pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('SELECT c.external_id, COUNT(*) AS total, ')),
  [fixtures.reqQuery.candidate, fixtures.db.voterId]
).resolves({ rowCount: 1, rows: [{ 'id': 'feature-id-one', 'total': 40, votedByCurrentVoter: 1 }] });

const expressReqStub = {
  query: fixtures.reqQuery,
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

  describe('when there is an external voter ID', () => {
    describe('when some of the candidates have been voted on', () => {
      const options = { enabled: true };

      it('queries postgres for the votes', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.getCalls().length).toBe(2);
      });

      it('responds with the view count as json', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);
        expect(expressResStub.json.calledWith({ 'feature-id-one': { total: 40, votedByCurrentVoter: 1 } })).toBe(true);
      });
    });
  });

  describe('when there is NO external voter ID', () => {
    // TODO: Add tests for anonymous retrieval
  });
});
