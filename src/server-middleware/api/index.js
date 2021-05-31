const express = require('express');
const defu = require('defu');

const app = express();
app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
app.use(express.json());

let runtimeConfig;
app.use((res, req, next) => {
  if (!runtimeConfig) {
    // Load Nuxt config once, at runtime
    const nuxtConfig = require('../../../nuxt.config');
    runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);
  }
  next();
});

const debugMemoryUsage = require('./debug/memory-usage');
app.get('/debug/memory-usage', debugMemoryUsage);

import jiraServiceDesk from './jira/service-desk';
app.post('/jira/service-desk', (req, res) => jiraServiceDesk(runtimeConfig.jira)(req, res));

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
