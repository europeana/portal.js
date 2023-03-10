import express from 'express';
import defu  from 'defu';
import apm from 'elastic-apm-node';
import logging from '../logging.js';

const app = express();
app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
app.use(express.json());
app.use(logging);

import nuxtConfig from '../../../nuxt.config.js';
let runtimeConfig;

app.use((res, req, next) => {
  if (!runtimeConfig) {
    // Load Nuxt config once, at runtime
    runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);
  }
  next();
});

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
app.get('/cache/*', (req, res) => cache(req.params[0], runtimeConfig.redis)(req, res));

import contentful from './contentful/index.js';
// Only POST methods so that GraphQL variables are properly type case in JSON request body
app.post('/contentful/graphql/:queryAlias', (req, res) => contentful(runtimeConfig.contentful).graphql(req, res));
app.post('/contentful/stories', (req, res) => contentful(runtimeConfig.contentful).stories(req, res));

import jiraServiceDeskFeedback from './jira-service-desk/feedback.js';
app.post('/jira-service-desk/feedback', (req, res) => jiraServiceDeskFeedback(runtimeConfig.jira)(req, res));
// TODO: Remove on subsequent release as only needed to suppor the switch to the new URL '/jira-service-desk/feedback'
app.post('/jira/service-desk', (req, res) => jiraServiceDeskFeedback(runtimeConfig.jira)(req, res));

import jiraServiceDeskGalleries from './jira-service-desk/galleries.js';
app.post('/jira-service-desk/galleries', (req, res) => jiraServiceDeskGalleries(runtimeConfig.jira)(req, res));

import version from './version.js';
app.get('/version', version);

app.all('/*', (req, res) => res.sendStatus(404));

// TODO: APM
export const errorHandler = (res, error) => {
  let status = error.status || 500;
  let message = error.message;

  if (error.response) {
    status = error.response.status;
    message = error.response.data.errorMessage || message;
  }

  res.status(status).set('Content-Type', 'text/plain').send(message);
};

export default app;
