import db from './model.js';
import auth from '../auth.js';

export default async(req, res) => {
  try {
    let voterExternalId = null;
    if (req.headers.authorization) {
      const userinfo = await auth.userinfo(req);
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
