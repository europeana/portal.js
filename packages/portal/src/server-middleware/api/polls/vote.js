import db from './model.js';
import auth from '../auth.js';
import createHttpError from 'http-errors';

export default async(req, res) => {
  let voterExternalId = null;
  if (req.headers.authorization) {
    const userinfo = await auth.userinfo(req);
    voterExternalId = userinfo?.sub || null;
  }
  if (voterExternalId === null) {
    throw createHttpError(401);
  }

  const { candidateExternalId } = req.params;

  const voterRow = await db.findVoter(voterExternalId) || await db.createVoter(voterExternalId);
  const candidateRow = await db.findCandidate(candidateExternalId) || await db.createCandidate(candidateExternalId);
  if (await db.findVote(voterRow.id, candidateRow.id)) {
    // Voter has already voted for this candidate
    throw createHttpError(409);
  }

  await db.createVote(voterRow.id, candidateRow.id);
  res.sendStatus(204);
};
