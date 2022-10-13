import config from './config.js';

import express from 'express';
import apm from 'elastic-apm-node';
import morgan from 'morgan';

const app = express();
app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
app.use(express.json());
app.use(morgan('combined')); // Use morgan for request logging

const runtimeConfig = config();

app.use((req, res, next) => {
  // TODO: configure and start APM somewhere...
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

import jiraServiceDesk from './jira/service-desk.js';
app.post('/jira/service-desk', (req, res) => jiraServiceDesk(runtimeConfig.jira)(req, res));

import version from './version.js';
app.get('/version', version);

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
