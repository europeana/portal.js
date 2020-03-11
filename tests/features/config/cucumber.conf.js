/* eslint-disable no-console */

const { setDefaultTimeout, After, AfterAll, Before, BeforeAll } = require('cucumber');
const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const isReachable = require('is-reachable');
const runners = require('../support/step-runners');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 443;
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

// Request a page and wait for the cookie notice
async function warmupBrowser() {
  // TODO: replace with a low cost static page not hitting any APIs
  await runners.openAPage('/en');
  await client.waitForElementVisible('.cookie-disclaimer');
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
  await warmupBrowser();
});

Before({ tags: '@cookie-notice-not-dismissed' }, async() => {
  await runners.haveNotYetAcceptedCookies();
});

Before({ tags: 'not @cookie-notice-not-dismissed' }, async() => {
  await runners.havePreviouslyAcceptedCookies();
});

After(async() => {
  await client.deleteCookies();
});

After({ tags: '@non-default-browser' }, async() => {
  // Restore default browser config
  await stopBrowser();
  await startBrowser();
  await warmupBrowser();
});

AfterAll(async() => {
  await stopBrowser();
});
