import pg from '../pg/pg.js';
import { keycloakUserinfo } from '../utils.js';

// TODO: validate user login
export default (config = {}) => {
  pg.config = config.postgres;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.sendStatus(503);
        return;
      }

      let voterExternalId = null;
      if (req.headers.authorization) {
        const userinfo = await keycloakUserinfo(req, config.auth.strategies.keycloak);
        voterExternalId = userinfo?.sub || null;
      }

      const candidateExternalId = req.body?.candidate;

      // if(notAuthorized) {
      //   res.sendStatus(401);
      // }

      let voterRow;
      const selectVoterResult = await pg.query(
        'SELECT id FROM polls.voters WHERE external_id=$1',
        [voterExternalId]
      );
      if (selectVoterResult.rowCount > 0) {
        voterRow = selectVoterResult.rows[0];
      } else {
        const insertVoterResult = await pg.query(
          'INSERT INTO polls.voters (external_id) VALUES($1) RETURNING id',
          [voterExternalId]
        );
        voterRow = insertVoterResult.rows[0];
      }

      let candidateRow;
      const selectCandidateResult = await pg.query(
        'SELECT id FROM polls.candidates WHERE external_id=$1',
        [candidateExternalId]
      );
      if (selectCandidateResult.rowCount > 0) {
        candidateRow = selectCandidateResult.rows[0];
      } else {
        const insertCandidateResult = await pg.query(
          'INSERT INTO polls.candidates (external_id) VALUES($1) RETURNING id',
          [candidateExternalId]
        );
        candidateRow = insertCandidateResult.rows[0];
      }

      const selectVoteResult = await pg.query(
        'SELECT id FROM polls.votes WHERE voter_id=$1 AND candidate_id=$2',
        [voterRow.id, candidateRow.id]
      );

      if (selectVoteResult.rowCount > 0) {
        // No need to insert new vote, voter has already voted for this candidate
      } else {
        await pg.query(`
          INSERT INTO polls.votes (voter_id, candidate_id, occurred_at)
          VALUES($1, $2, CURRENT_TIMESTAMP)
          `,
        [voterRow.id, candidateRow.id]
        );
      }
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      const status = err.response?.status || 500;
      res.sendStatus(status);
    }
  };
};
