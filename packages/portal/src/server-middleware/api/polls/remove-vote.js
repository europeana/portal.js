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

  const voterRow = await db.findVoter(voterExternalId);
  if (!voterRow) {
    // voter doesn't exist, can't have voted on anything
    throw createHttpError(403);
  }

  const { candidateExternalId } = req.params;
  const candidateRow = await db.findCandidate(candidateExternalId);
  if (!candidateRow) {
    // candidate doesn't exist, can't have been voted on
    throw createHttpError(404);
  }

  const voteRow = await db.findVote(voterRow.id, candidateRow.id);
  if (!voteRow) {
    // vote doesn't exist, no need to remove
    throw createHttpError(404);
  }

  await db.deleteVote(voteRow.id);
  res.sendStatus(204);
};
