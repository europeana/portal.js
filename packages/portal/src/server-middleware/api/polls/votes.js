import initModel from './model.js';
import { keycloakUserinfo } from '../utils.js';

export default (config = {}) => {
  const db = initModel(config.postgres);

  return async(req, res) => {
    try {
      let voterExternalId = null;
      if (req.headers.authorization) {
        const userinfo = await keycloakUserinfo(req, config.auth.strategies.keycloak);
        voterExternalId = userinfo?.sub || null;
      }

      const candidateExternalIds = req.query?.candidate?.split(',') || [];

      const voterRow = await db.findVoter(voterExternalId) || { id: null };

      const votesForCandidates = await db.findVotes(voterRow.id, candidateExternalIds);

      res.json(votesForCandidates.reduce((memo, row) => {
        memo[row.external_id] = {
          total: row.total,
          votedByCurrentVoter: row.voted_by_current_voter === '1'
        };
        return memo;
      }, {}));
    } catch (err) {
      console.error(err);
      const status = err.response?.status || 500;
      res.sendStatus(status);
    }
  };
};
