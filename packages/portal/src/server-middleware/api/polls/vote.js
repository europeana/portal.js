import db from './model.js';
import auth from '../auth.js';

export default async(req, res) => {
  try {
    let voterExternalId = null;
    if (req.headers.authorization) {
      const userinfo = await auth.userinfo(req);
      voterExternalId = userinfo?.sub || null;
    }
    if (voterExternalId === null) {
      res.sendStatus(401);
      return;
    }

    const { candidateExternalId } = req.params;

    const voterRow = await db.findVoter(voterExternalId) || await db.createVoter(voterExternalId);
    const candidateRow = await db.findCandidate(candidateExternalId) || await db.createCandidate(candidateExternalId);
    if (await db.findVote(voterRow.id, candidateRow.id)) {
      // Voter has already voted for this candidate
      res.sendStatus(409);
      return;
    }

    await db.createVote(voterRow.id, candidateRow.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    const status = err.response?.status || 500;
    res.sendStatus(status);
  }
};
