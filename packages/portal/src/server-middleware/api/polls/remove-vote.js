import createHttpError from 'http-errors';

import db from './model.js';
import keycloak from '../keycloak.js';

export default async(req, res, next) => {
  try {
    const voterExternalId = await keycloak.userId(req.headers.authorization);
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
  } catch (err) {
    next(err);
  }
};
