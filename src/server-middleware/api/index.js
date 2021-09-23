import express from 'express';
import defu  from 'defu';
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

import debugMemoryUsage from './debug/memory-usage.js';
app.get('/debug/memory-usage', debugMemoryUsage);

import entitiesOrganisations from './entities/organisations.js';
app.get('/entities/organisations', (req, res) => entitiesOrganisations(runtimeConfig)(req, res));

import dailyEntries from './dailyEntries.js';
app.get('/entities/topics', (req, res) => dailyEntries('topic', runtimeConfig)(req, res));
app.get('/entities/times', (req, res) => dailyEntries('time', runtimeConfig)(req, res));
app.get('/items/recent', (req, res) => dailyEntries('item', runtimeConfig)(req, res));
app.get('/items/itemCountsMediaType', (req, res) => dailyEntries('itemCountsMediaType', runtimeConfig)(req, res));

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
