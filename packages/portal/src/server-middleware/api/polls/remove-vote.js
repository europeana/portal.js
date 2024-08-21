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
        // voter doesn't exist, can't have voted on anything
        res.sendStatus(204);
        return;
      }

      let candidateRow;
      const selectCandidateResult = await pg.query(
        'SELECT id FROM polls.candidates WHERE external_id=$1',
        [candidateExternalId]
      );
      if (selectCandidateResult.rowCount > 0) {
        candidateRow = selectCandidateResult.rows[0];
      } else {
        // candidate doesn't exist, can't have been voted on
        res.sendStatus(204);
        return;
      }

      let voteRow;
      const selectVoteResult = await pg.query(
        'SELECT id FROM polls.votes WHERE voter_id=$1 AND candidate_id=$2',
        [voterRow.id, candidateRow.id]
      );
      if (selectVoteResult.rowCount > 0) {
        voteRow = selectVoteResult.rows[0];
      } else {
        // vote doesn't exist, no need to remove
        res.sendStatus(204);
        return;
      }

      await pg.query(
        'DELETE FROM polls.votes WHERE id=$1',
        [voteRow.id]
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      const status = err.response?.status || 500;
      res.sendStatus(status);
    }
  };
};
