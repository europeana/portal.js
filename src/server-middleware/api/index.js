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

app.use((res, req, next) => {
  if (apm.isStarted())  {
    // Elastic APM Node agent instruments Express requests automatically, but
    // omits any prefix such as /_api/, so override the transactions name here
    // to restore it form the original URL.
    apm.setTransactionName(`${req.req.method} ${req.req.originalUrl.split('?')[0]}`);
  }
  next();
});

import debugMemoryUsage from './debug/memory-usage.js';
app.get('/debug/memory-usage', debugMemoryUsage);

// FIXME: changing the URLs will break clients already using the site.
//        support old URLs (temporarily). with a redirect?

import cache from './cache/index.js';
app.get('/cache/*', (req, res) => cache(req.params[0], runtimeConfig)(req, res));

import collections from './collections/index.js';
app.get('/collections/:type', (req, res) => collections(req.params.type, runtimeConfig)(req, res));

import daily from './daily/index.js';
app.get('/daily/*', (req, res) => daily(req.params[0], runtimeConfig)(req, res));

import jiraServiceDesk from './jira/service-desk.js';
app.post('/jira/service-desk', (req, res) => jiraServiceDesk(runtimeConfig.jira)(req, res));

import version from './version.js';
app.get('/version', version);

app.all('/*', (req, res) => res.sendStatus(404));

export const errorHandler = (res, error) => {
  if (error.response) {
    res.status(error.response.status).set('Content-Type', 'text/plain').send(error.response.data.errorMessage);
  } else {
    res.status(error.status || 500).set('Content-Type', 'text/plain').send(error.message);
  }
};

export default app;
