import pg from 'pg';
import sinon from 'sinon';

import pollsModel from '@/server-middleware/api/polls/model.js';

describe('@/server-middleware/api/polls/model', () => {
  beforeEach(() => {
    const pgPoolQueryStub = sinon.stub().rejects(new Error('Unstubbed query'));
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQueryStub);
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('findVoter', () => {
    const voterExternalId = 'keycloak-uuid';
    const voterRow = { id: 7 };
    const sqlMatcher = 'SELECT id FROM polls.voters WHERE external_id=$1';
    const argsMatcher = [voterExternalId];

    it('selects from voters table', async() => {
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

      await pollsModel.findVoter(voterExternalId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
    });

    describe('when voter row is found', () => {
      it('is returned', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 1, rows: [voterRow] });

        const voter = await pollsModel.findVoter(voterExternalId);

        expect(voter).toEqual(voterRow);
      });
    });

    describe('when voter row is not found', () => {
      it('returns null', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 0 });

        const voter = await pollsModel.findVoter(voterExternalId);

        expect(voter).toBeNull();
      });
    });
  });

  describe('createVoter', () => {
    it('inserts row into voters table and returns it', async() => {
      const voterExternalId = 'keycloak-uuid';
      const voterRow = { id: 7 };
      const sqlMatcher = 'INSERT INTO polls.voters (external_id) VALUES($1) RETURNING id';
      const argsMatcher = [voterExternalId];
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rows: [voterRow] });

      const voter = await pollsModel.createVoter(voterExternalId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
      expect(voter).toEqual(voterRow);
    });
  });

  describe('findCandidate', () => {
    const candidateExternalId = 'new-feature';
    const candidateRow = { id: 7 };
    const sqlMatcher = 'SELECT id FROM polls.candidates WHERE external_id=$1';
    const argsMatcher = [candidateExternalId];

    it('selects from candidates table', async() => {
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

      await pollsModel.findCandidate(candidateExternalId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
    });

    describe('when candidate row is found', () => {
      it('is returned', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 1, rows: [candidateRow] });

        const voter = await pollsModel.findCandidate(candidateExternalId);

        expect(voter).toEqual(candidateRow);
      });
    });

    describe('when candidate row is not found', () => {
      it('returns null', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 0 });

        const voter = await pollsModel.findCandidate(candidateExternalId);

        expect(voter).toBeNull();
      });
    });
  });

  describe('createCandidate', () => {
    it('inserts row into candidates table and returns it', async() => {
      const candidateExternalId = 'new-feature';
      const candidateRow = { id: 7 };
      const sqlMatcher = 'INSERT INTO polls.candidates (external_id) VALUES($1) RETURNING id';
      const argsMatcher = [candidateExternalId];
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rows: [candidateRow] });

      const candidate = await pollsModel.createCandidate(candidateExternalId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
      expect(candidate).toEqual(candidateRow);
    });
  });

  describe('findVote', () => {
    const voterId = 5;
    const candidateId = 6;
    const voteRow = { id: 7 };
    const sqlMatcher = 'SELECT id FROM polls.votes WHERE voter_id=$1 AND candidate_id=$2';
    const argsMatcher = [voterId, candidateId];

    it('selects from votes table', async() => {
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

      await pollsModel.findVote(voterId, candidateId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
    });

    describe('when candidate row is found', () => {
      it('is returned', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 1, rows: [voteRow] });

        const vote = await pollsModel.findVote(voterId, candidateId);

        expect(vote).toEqual(voteRow);
      });
    });

    describe('when candidate row is not found', () => {
      it('returns null', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rowCount: 0 });

        const vote = await pollsModel.findVote(voterId, candidateId);

        expect(vote).toBeNull();
      });
    });
  });

  describe('findVotes', () => {
    const voterId = 5;
    const candidateExternalIds = ['new-feature'];
    const voteRows = [{ id: 6 }];
    const sqlMatcher = sinon.match((sqlMatcher) => sqlMatcher.includes('FROM polls.votes v LEFT JOIN polls.candidates c'));
    const argsMatcher = sinon.match.array.contains([voterId, candidateExternalIds]);

    it('selects from votes table', async() => {
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

      await pollsModel.findVotes(voterId, candidateExternalIds);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
    });

    describe('when votes are found', () => {
      it('returns them', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rows: voteRows });

        const votes = await pollsModel.findVotes(voterId, candidateExternalIds);

        expect(votes).toEqual(voteRows);
      });
    });

    describe('when votes are not found', () => {
      it('returns []', async() => {
        pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

        const votes = await pollsModel.findVotes(voterId, candidateExternalIds);

        expect(votes).toEqual([]);
      });
    });
  });

  describe('createVote', () => {
    it('inserts row into votes table and returns it', async() => {
      const voterId = 5;
      const candidateId = 6;
      const voteRow = { id: 7 };
      const sqlMatcher = 'INSERT INTO polls.votes (voter_id, candidate_id, occurred_at) VALUES($1, $2, CURRENT_TIMESTAMP)';
      const argsMatcher = [voterId, candidateId];
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({ rows: [voteRow] });

      const vote = await pollsModel.createVote(voterId, candidateId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
      expect(vote).toEqual(voteRow);
    });
  });

  describe('deleteVote', () => {
    it('deletes row from votes table', async() => {
      const voteId = 8;
      const sqlMatcher = 'DELETE FROM polls.votes WHERE id=$1';
      const argsMatcher = [voteId];
      pg.Pool.prototype.query.withArgs(sqlMatcher, argsMatcher).resolves({});

      await pollsModel.deleteVote(voteId);

      expect(pg.Pool.prototype.query.calledWith(sqlMatcher, argsMatcher)).toBe(true);
    });
  });
});
