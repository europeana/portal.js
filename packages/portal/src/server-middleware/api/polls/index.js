import express from 'express';

import getVotes from './votes.js';
import putPollVote from './vote.js';
import deletePollVote from './remove-vote.js';

const router = express.Router();

router.get('/', getVotes);
router.put('/:candidateExternalId', putPollVote);
router.delete('/:candidateExternalId', deletePollVote);

export default router;
