import pg from '../pg/pg.js';

// TODO: authorisation for current user before retrieving the voterId
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.json([]);
        return;
      }

      const candidateExternalIds = req.query?.candidate || [];
      const voterExternalId  = req.query?.voter;

      let voterRow = { id: null };
      if (voterExternalId) {
        const selectVoterResult = await pg.query(
          'SELECT id FROM polls.voters WHERE external_id=$1',
          [voterExternalId]
        );
        if (selectVoterResult.rowCount > 0) {
          voterRow = selectVoterResult.rows[0];
        }
      }

      const votesForCandidates = await pg.query(`
        SELECT c.external_id, COUNT(*) AS total, (SELECT COUNT(*) FROM polls.votes WHERE voter_id=$2 AND candidate_id=c.id) AS votedByCurrentVoter
          FROM polls.votes v LEFT JOIN polls.candidates c
          ON v.candidate_id=c.id
        WHERE c.external_id LIKE ANY('{$1}')
        GROUP BY (c.id)
        `,
      [candidateExternalIds, voterRow.id]
      );

      if (votesForCandidates.rowCount < 0) {
        // Nobody has voted on anything yet
        res.json([]);
        return;
      }

      res.json(votesForCandidates.rows.reduce((memo, row) => {
        memo[row.id] = {
          total: row.total,
          votedByCurrentVoter: row.votedByCurrentVoter
        };
        return memo;
      }, {}));
    } catch (err) {
      console.error(err);
    }
  };
};
