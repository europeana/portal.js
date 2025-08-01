import db from './model.js';
import keycloak from '../keycloak.js';

export default async(req, res, next) => {
  try {
    const voterExternalId = await keycloak.userId(req.headers.authorization);
    const candidateExternalIds = req.query?.candidate?.split(',') || [];

    const voter = await db.findVoter(voterExternalId);
    const votes = await db.findVotes(voter?.id, candidateExternalIds);

    res.json(votes.reduce((memo, row) => {
      memo[row.external_id] = {
        total: row.total,
        votedByCurrentVoter: row.voted_by_current_voter === '1'
      };
      return memo;
    }, {}));
  } catch (err) {
    next(err);
  }
};
