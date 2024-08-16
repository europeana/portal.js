import express from 'express';
import cors from 'cors';
import apm from 'elastic-apm-node';

import logging from '../logging.js';
import { forbiddenUnlessOriginAllowed, nuxtRuntimeConfig } from './utils.js';

const app = express();
app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
app.use(express.json());
app.use(logging);

const runtimeConfig = nuxtRuntimeConfig();

app.use((req, res, next) => {
  if (apm.isStarted())  {
    // Elastic APM Node agent instruments Express requests automatically, but
    // omits any prefix such as /_api/, so override the transactions name here
    // to restore it form the original URL.
    apm.setTransactionName(`${req.method} ${req.originalUrl.split('?')[0]}`);
  }
  next();
});

import debugMemoryUsage from './debug/memory-usage.js';
app.get('/debug/memory-usage', debugMemoryUsage);

import cache from './cache/index.js';
const cacheHandler = cache(runtimeConfig.redis);
app.get('/cache', cacheHandler);
app.get('/cache/*', cacheHandler);

// TODO: move to a standalone express micro-service, so the portal.js app does
//       not have a direct dependency on postgres, indeed need not know what
//       back-end storage is used.
import logEvent from './events/log.js';
app.post('/events', logEvent(runtimeConfig.postgres));
import eventTrending from './events/trending.js';
app.get('/events/trending', eventTrending(runtimeConfig.postgres));
import eventViews from './events/views.js';
app.get('/events/views', eventViews(runtimeConfig.postgres));

import jiraServiceDeskFeedback from './jira-service-desk/feedback.js';
const feedbackCorsOptions = {
  origin: forbiddenUnlessOriginAllowed(runtimeConfig.app.feedback.cors.origin)
};
app.options('/jira-service-desk/feedback',
  cors(feedbackCorsOptions),
  (req, res) => res.sendStatus(200)
);
app.post('/jira-service-desk/feedback',
  cors(feedbackCorsOptions),
  jiraServiceDeskFeedback(runtimeConfig.jira)
);

import jiraServiceDeskGalleries from './jira-service-desk/galleries.js';
app.post('/jira-service-desk/galleries', jiraServiceDeskGalleries(runtimeConfig.jira));

import version from './version.js';
app.get('/version', version);

import votes from './polls/votes.js';
app.get('/votes', votes);
import vote from './polls/vote.js';
app.post('/vote', vote);
import removeVote from './polls/removeVote.js';
app.delete('/vote', removeVote);

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
