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
      if (voterExternalId === null) {
        res.sendStatus(401);
        return;
      }

      const voterRow = await db.findVoter(voterExternalId);
      if (!voterRow) {
        // voter doesn't exist, can't have voted on anything
        res.sendStatus(403);
        return;
      }

      const { candidateExternalId } = req.params;
      const candidateRow = await db.findCandidate(candidateExternalId);
      if (!candidateRow) {
        // candidate doesn't exist, can't have been voted on
        res.sendStatus(404);
        return;
      }

      const voteRow = await db.findVote(voterRow.id, candidateRow.id);
      if (!voteRow) {
        // vote doesn't exist, no need to remove
        res.sendStatus(404);
        return;
      }

      await db.deleteVote(voteRow.id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      const status = err.response?.status || 500;
      res.sendStatus(status);
    }
  };
};
