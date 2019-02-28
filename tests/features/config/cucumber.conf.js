const { setDefaultTimeout, AfterAll, BeforeAll } = require('cucumber');
const { createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const isReachable = require('is-reachable');
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 1337;
const maxWaitTime = 30;

setDefaultTimeout(60000);

BeforeAll(async () => {
  console.log('Waiting for test server...');
  let i = 0;
  while (!(await isReachable(`${host}:${port}`)) && (i <= maxWaitTime) ) {
    i++;
    await sleep(1000);
  }
  if (!(await isReachable(`${host}:${port}`))) {
    throw `Unable to reach the test server within ${maxWaitTime} seconds!`;
  }
  await startWebDriver({ configFile: 'tests/features/config/nightwatch.conf.js', env: process.env.browser || 'default' });
  await createSession({ configFile: 'tests/features/config/nightwatch.conf.js' });
});

AfterAll(async () => {
  await closeSession();
  await stopWebDriver();
});
