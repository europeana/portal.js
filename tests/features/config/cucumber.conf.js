const { setDefaultTimeout, AfterAll, BeforeAll } = require('cucumber');
const { createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');

setDefaultTimeout(60000);

BeforeAll(async () => {
  await startWebDriver({ configFile: 'tests/features/config/nightwatch.conf.js', env: process.env.browser || 'default' });
  await createSession({ configFile: 'tests/features/config/nightwatch.conf.js' });
});

AfterAll(async () => {
  await closeSession();
  await stopWebDriver();
});
