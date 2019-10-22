/* eslint-disable no-console */

const { setDefaultTimeout, After, AfterAll, BeforeAll } = require('cucumber');
const { createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const isReachable = require('is-reachable');
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 1337;
const maxWaitTime = 90;

const browserEnv = process.env.browser || 'gecko';
const nightwatchApiOptions = {
  configFile: 'tests/features/config/nightwatch.conf.js',
  env: browserEnv,
  silent: true
};

setDefaultTimeout(100000);

async function startBrowser() {
  await startWebDriver(nightwatchApiOptions);
  await createSession(nightwatchApiOptions);
}

async function stopBrowser() {
  await closeSession();
  await stopWebDriver();

  // Prevent MaxListenersExceededWarning warnings
  process.removeAllListeners();
}

// Before running cucumber make sure the test server and webdriver are running.
// The test server is started by the test script in package.json.
// The web driver is started in this before block.
BeforeAll(async() => {
  const testServer = `${host}:${port}`;

  console.log(`Waiting for test server ${testServer}...`);
  let i = 0;
  while (!(await isReachable(testServer)) && (i <= maxWaitTime)) {
    i++;
    await sleep(1000);
  }
  if (!(await isReachable(testServer))) {
    throw `Unable to reach the test server within ${maxWaitTime} seconds!`;
  }

  await startBrowser();
});

After({ tags: '@non-default-browser' }, async() => {
  // Restore default browser config
  await stopBrowser();
  await startBrowser();
});

AfterAll(async() => {
  await stopBrowser();
});
