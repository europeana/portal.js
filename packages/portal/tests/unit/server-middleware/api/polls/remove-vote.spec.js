import pg from 'pg';
import sinon from 'sinon';

import removeVoteEventsHandler from '@/server-middleware/api/polls/remove-vote';

const fixtures = {
  db: {
    voterId: 1,
    candidateId: 2,
    voteId: 3
  },
  reqBody: {
    voterExternalId: 'keycloak_uuid',
    candidateExternalId: 'contentful_sys_id'
  }
};

const pgPoolQuery = sinon.stub();
pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.voters ')),
  [fixtures.reqBody.voterExternalId]
).resolves({ rowCount: 1, rows: [{ id: fixtures.db.voterId }] });

pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.candidates ')),
  [fixtures.reqBody.candidateExternalId]
).resolves({ rowCount: 1, rows: [{ id: fixtures.db.candidateId }] });

pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('SELECT id FROM polls.votes ')),
  [fixtures.db.voterId, fixtures.db.candidateId]
).resolves({ rowCount: 1, rows: [{ id: fixtures.db.voteId }] });

pgPoolQuery.withArgs(
  sinon.match((sql) => sql.startsWith('DELETE FROM polls.votes ')),
  [fixtures.db.voteId]
).resolves();

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
      await removeVoteEventsHandler(options)(expressReqStub, expressResStub);

      expect(pgPoolQuery.called).toBe(false);
    });

    it('responds with 503 status', async() => {
      await removeVoteEventsHandler(options)(expressReqStub, expressResStub);

      expect(expressResStub.sendStatus.calledWith(503)).toBe(true);
    });
  });

  describe('when explicitly enabled', () => {
    const options = { enabled: true };

    const expressReqStub = {
      body: fixtures.reqBody,
      get: sinon.spy()
    };

    describe('when voting on behalf of a voter with a valid session', () => {
      // TODO: authorisation
      it('runs all postgres queries to vote on the candidate', async() => {
        await removeVoteEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.getCalls().length).toBe(4);
      });

      it('responds with 204 status', async() => {
        await removeVoteEventsHandler(options)(expressReqStub, expressResStub);

        expect(expressResStub.sendStatus.calledWith(204)).toBe(true);
      });
    });
  });
});

