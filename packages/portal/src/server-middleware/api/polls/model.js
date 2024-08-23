import pg from '../pg.js';

const findVoter = async(voterExternalId) => {
  const selectVoterResult = await pg.query(
    'SELECT id FROM polls.voters WHERE external_id=$1',
    [voterExternalId]
  );
  return (selectVoterResult.rowCount > 0) ? selectVoterResult.rows[0] : null;
};

const createVoter = async(voterExternalId) => {
  const insertVoterResult = await pg.query(
    'INSERT INTO polls.voters (external_id) VALUES($1) RETURNING id',
    [voterExternalId]
  );
  return insertVoterResult.rows[0];
};

const findCandidate = async(candidateExternalId) => {
  const selectCandidateResult = await pg.query(
    'SELECT id FROM polls.candidates WHERE external_id=$1',
    [candidateExternalId]
  );
  return (selectCandidateResult.rowCount > 0) ? selectCandidateResult.rows[0] : null;
};

// TODO: sanity check this against external data sources?
const createCandidate = async(candidateExternalId) => {
  const insertCandidateResult = await pg.query(
    'INSERT INTO polls.candidates (external_id) VALUES($1) RETURNING id',
    [candidateExternalId]
  );
  return insertCandidateResult.rows[0];
};

const findVote = async(voterId, candidateId) => {
  const selectVoteResult = await pg.query(
    'SELECT id FROM polls.votes WHERE voter_id=$1 AND candidate_id=$2',
    [voterId, candidateId]
  );
  return (selectVoteResult.rowCount > 0) ? selectVoteResult.rows[0] : null;
};

const findVotes = async(voterId, candidateExternalIds) => {
  const selectVotesResult = await pg.query(
    `
      SELECT c.external_id, COUNT(*) AS total, (SELECT COUNT(*) FROM polls.votes WHERE voter_id=$2 AND candidate_id=c.id) AS voted_by_current_voter
        FROM polls.votes v LEFT JOIN polls.candidates c
        ON v.candidate_id=c.id
        WHERE c.external_id LIKE ANY($1)
        GROUP BY (c.id)
    `,
    [candidateExternalIds, voterId]
  );
  return selectVotesResult.rows || [];
};

const createVote = async(voterId, candidateId) => {
  const insertVoteResult = await pg.query(
    'INSERT INTO polls.votes (voter_id, candidate_id, occurred_at) VALUES($1, $2, CURRENT_TIMESTAMP)',
    [voterId, candidateId]
  );
  return insertVoteResult.rows[0];
};

const deleteVote = async(voteId) => {
  return await pg.query(
    'DELETE FROM polls.votes WHERE id=$1',
    [voteId]
  );
};

export default {
  createCandidate,
  createVote,
  createVoter,
  deleteVote,
  findCandidate,
  findVote,
  findVotes,
  findVoter
};
