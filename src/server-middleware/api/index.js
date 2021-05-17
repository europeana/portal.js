const express = require('express');
const defu = require('defu');

const app = express();
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

const jiraServiceDesk = require('./jira/service-desk');
app.post('/jira/service-desk', (res, req, next) => jiraServiceDesk(runtimeConfig.jira)(res, req, next));

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
