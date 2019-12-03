/* eslint-disable no-console */

const { setDefaultTimeout, After, AfterAll, Before, BeforeAll } = require('cucumber');
const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const isReachable = require('is-reachable');
const runners = require('../support/step-runners');

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
  // Do this first so that the cookie acceptance on the first scenario does not fail
  // TODO: replace with a low cost static page not hitting any APIs
  await runners.openAPage('/en');
});

Before({ tags: '@cookie-notice-dismissed' }, async() => {
  await runners.havePreviouslyAcceptedCookies();
});

Before({ tags: 'not @cookie-notice-dismissed' }, async() => {
  await runners.haveNotYetAcceptedCookies();
});

After(async() => {
  await client.deleteCookies();
});

After({ tags: '@non-default-browser' }, async() => {
  // Restore default browser config
  await stopBrowser();
  await startBrowser();
  // TODO: replace with a low cost static page not hitting any APIs
  await runners.openAPage('/en');
});

AfterAll(async() => {
  await stopBrowser();
});
