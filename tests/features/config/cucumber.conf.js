/* eslint-disable no-console */

const { setDefaultTimeout, After, AfterAll, Before, BeforeAll } = require('cucumber');
const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const runners = require('../support/step-runners');

require('../support/step-definitions');

const nightwatchApiOptions = {
  configFile: 'config/nightwatch.conf.js',
  env: 'chrome-en',
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
  await startBrowser();
  await warmupBrowser();
});

Before({ tags: '@cookie-notice-not-dismissed' }, async() => {
  await runners.haveNotYetAcceptedCookies();
});

Before({ tags: 'not @cookie-notice-not-dismissed' }, async() => {
  await runners.havePreviouslyAcceptedCookies();
});
Before({ tags: '@debug-apirequests-not-enabled' }, async() => {
  await runners.haveNotEnabledDebugAPIRequests();
});

Before({ tags: '@logged-in' }, async() => {
  await runners.logIn();
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

After({ tags: '@logged-in' }, async() => {
  // Log the user out, so as to not pollute other tests.
  await runners.logOut();
});

AfterAll(async() => {
  await stopBrowser();
});
