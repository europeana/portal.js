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

// Redirection of some deprecated API URL paths.
// TODO: remove redirection of deprecated routes after new routes are
//       well-established in production
const pathWithQuery = (path, query) => {
  let destination = path;

  const searchParams = new URLSearchParams(query).toString();
  if (searchParams !== '') {
    destination = `${path}?${searchParams}`;
  }

  return destination;
};
app.get('/entities/organisations', (req, res) => res.redirect(pathWithQuery('/_api/cache/collections/organisations', req.query)));
app.get('/entities/times', (req, res) => res.redirect(pathWithQuery('/_api/cache/collections/times', { ...req.query, daily: 'true' })));
app.get('/entities/topics', (req, res) => res.redirect(pathWithQuery('/_api/cache/collections/topics/featured', { ...req.query, daily: 'true' })));
app.get('/items/recent', (req, res) => res.redirect(pathWithQuery('/_api/cache/items/recent', req.query)));
app.get('/items/itemCountsMediaType', (req, res) => res.redirect(pathWithQuery('/_api/cache/items/typeCounts', req.query)));

import cache from './cache/index.js';
app.get('/cache/*', (req, res) => cache(req.params[0], runtimeConfig)(req, res));

import jiraServiceDesk from './jira/service-desk.js';
app.post('/jira/service-desk', (req, res) => jiraServiceDesk(runtimeConfig.jira)(req, res));

import version from './version.js';
app.get('/version', version);

app.all('/*', (req, res) => res.sendStatus(404));

export const errorHandler = (res, error) => {
  let status = error.status || 500;
  let message = error.message;

  if (error.response) {
    status = error.response.status;
    message = error.response.data.errorMessage;
  }

  res.status(status).set('Content-Type', 'text/plain').send(message);
};

export default app;
