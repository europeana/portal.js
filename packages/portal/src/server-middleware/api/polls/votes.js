import pg from '../pg/pg.js';
import { keycloakUserinfo } from '../utils.js';

// TODO: authorisation for current user before retrieving the voterId
export default (config = {}) => {
  pg.config = config.postgres;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.json([]);
        return;
      }

      let voterExternalId = null;
      if (req.headers.authorization) {
        try {
          const userinfo = await keycloakUserinfo(req, config.auth.strategies.keycloak);
          voterExternalId = userinfo?.sub || null;
        } catch (err) {
          console.error('keycloak error', err);
          // TODO: handle
          res.sendStatus(500);
        }
      }

      const candidateExternalIds = req.query?.candidate?.split(',') || [];

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
        SELECT c.external_id, COUNT(*) AS total, (SELECT COUNT(*) FROM polls.votes WHERE voter_id=$2 AND candidate_id=c.id) AS voted_by_current_voter
          FROM polls.votes v LEFT JOIN polls.candidates c
          ON v.candidate_id=c.id
          WHERE c.external_id LIKE ANY($1)
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
        console.log('votesForCandidates row', row);
        memo[row.external_id] = {
          total: row.total,
          votedByCurrentVoter: row.voted_by_current_voter === '1'
        };
        return memo;
      }, {}));
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  };
};
