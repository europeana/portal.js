import createHttpError from 'http-errors';

import db from './model.js';
import keycloak from '../keycloak.js';

export default async(req, res, next) => {
  try {
    const voterExternalId = await keycloak.userId(req.headers.authorization);
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
  } catch (err) {
    next(err);
  }
};
