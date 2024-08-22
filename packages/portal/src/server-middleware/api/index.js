// TODO: replace route-specific error handling with one error handler middleware
//       @see https://expressjs.com/en/guide/error-handling.html

import express from 'express';
import cors from 'cors';
import apm from 'elastic-apm-node';

import logging from '../logging.js';
import pg from './pg.js';
import auth from './auth.js';
import { forbiddenUnlessOriginAllowed, nuxtRuntimeConfig } from './utils.js';

const app = express();
app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
app.use(express.json());
app.use(logging);

const runtimeConfig = nuxtRuntimeConfig();
pg.config = runtimeConfig.postgres;
auth.config = runtimeConfig.auth.strategies.keycloak;

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

import events from './events/index.js';
app.use('/events', events);

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

import polls from './polls/index.js';
app.use('/votes', polls);

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
