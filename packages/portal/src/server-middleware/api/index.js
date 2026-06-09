import express from 'express';
import cors from 'cors';
import apm from 'elastic-apm-node';

import logging from '../logging.js';
import pg from './pg.js';
import keycloak from './keycloak.js';
import { errorHandler, forbiddenUnlessOriginAllowed } from './utils.js';

import debugMemoryUsage from './debug/memory-usage.js';
import cache from './cache/index.js';
import events from './events/index.js';
import jiraServiceDeskFeedback from './jira-service-desk/feedback.js';
import jiraServiceDeskGalleries from './jira-service-desk/galleries.js';
import version from './version.js';
import polls from './polls/index.js';
import createCollectionsIndexEndpoint from './collections/index.js';
import createCollectionsRetrieveEndpoint from './collections/retrieve.js';

export const createApiExpressApp = (context = {}, app) => {
  const config = context.$config || {};

  app ||= express();

  app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
  app.use(express.json());
  app.use(logging);

  pg.config = config.postgres;
  keycloak.config = config.auth;

  app.use((req, res, next) => {
    if (apm.isStarted())  {
      // Elastic APM Node agent instruments Express requests automatically, but
      // omits any prefix such as /_api/, so override the transactions name here
      // to restore it form the original URL.
      apm.setTransactionName(`${req.method} ${req.originalUrl.split('?')[0]}`);
    }
    next();
  });

  app.get('/debug/memory-usage', debugMemoryUsage);

  const cacheHandler = cache(config.redis);
  app.get('/cache', cacheHandler);
  app.get('/cache/*', cacheHandler);

  app.use('/events', events);

  const feedbackCorsOptions = {
    origin: forbiddenUnlessOriginAllowed(config.app?.feedback?.cors?.origin)
  };
  app.options('/jira-service-desk/feedback',
    cors(feedbackCorsOptions),
    (req, res) => res.sendStatus(200)
  );
  app.post('/jira-service-desk/feedback',
    cors(feedbackCorsOptions),
    jiraServiceDeskFeedback(config.jira)
  );

  app.post('/jira-service-desk/galleries', jiraServiceDeskGalleries(config.jira));

  app.get('/version', version);

  app.use('/votes', polls);

  const collectionsIndexEndpoint = createCollectionsIndexEndpoint(config.redis);
  app.get('/collections/*', collectionsIndexEndpoint);

  const collectionsRetrieveEndpoint = createCollectionsRetrieveEndpoint(context);
  app.post('/collections/retrieve', collectionsRetrieveEndpoint);

  app.all('/*', (req, res) => res.sendStatus(404));
  app.use(errorHandler);

  return app;
};
