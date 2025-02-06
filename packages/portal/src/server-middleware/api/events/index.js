// TODO: move to a standalone express micro-service, so the portal.js app does
//       not have a direct dependency on postgres, indeed need not know what
//       back-end storage is used.

import express from 'express';

import logEvent from './log.js';
import eventTrending from './trending.js';
import eventViews from './views.js';

const router = express.Router();

router.post('/', logEvent);
router.get('/trending', eventTrending);
router.get('/views', eventViews);

export default router;
