import config from './config.js';

import debugMemoryUsage from './debug/memory-usage.js';
import cache from './cache/index.js';
import jiraServiceDesk from './jira/service-desk.js';
import version from './version.js';

const runtimeConfig = config();

export default (app) => {
  app.get('/debug/memory-usage', debugMemoryUsage);

  app.get('/cache/*', (req, res) => cache(req.params[0], runtimeConfig.redis)(req, res));

  app.post('/jira/service-desk', (req, res) => jiraServiceDesk(runtimeConfig.jira)(req, res));

  app.get('/version', version);

  return app;
};
