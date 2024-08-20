import pg from 'pg';
import sinon from 'sinon';

import voteEventsHandler from '@/server-middleware/api/polls/vote';

const fixtures = {
  db: {
    voterId: 2,
    candidateId: 1
  },
  reqBody: {
    voterExternalId: 'keycloak_uuid',
    candidateExternalId: 'contentful_id'
  }
};

const pgPoolQuery = sinon.stub();
// Stub voter queries
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.voters ')),
  [fixtures.reqBody.voterExternalId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO polls.voters ')),
  [fixtures.reqBody.voterExternalId]
)
  .resolves({ rows: [{ id: fixtures.db.voterId }] });

// Stub candidate queries
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.candidates ')),
  [fixtures.reqBody.candidateExternalId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('INSERT INTO polls.candidates ')),
  [fixtures.reqBody.candidateExternalId]
)
  .resolves({ rows: [{ id: fixtures.db.candidateId }] });

// Stub vote queries
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.votes ')),
  [fixtures.db.voterId, fixtures.db.candidateId]
)
  .resolves({ rowCount: 0 });
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.trim().startsWith('INSERT INTO polls.votes ')),
  [fixtures.db.voterId, fixtures.db.candidateId]
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

    describe('when for voting on behalf of a voter with a valid session', () => {
      // TODO: authorisation
      it('runs all postgres queries to vote on the candidate', async() => {
        await voteEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.getCalls().length).toBe(6);
      });

      it('responds with 200 status', async() => {
        await voteEventsHandler(options)(expressReqStub, expressResStub);

        expect(expressResStub.sendStatus.calledWith(200)).toBe(true);
      });
    });
  });
});

