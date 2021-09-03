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
  await client.waitForElementVisible('#eu-klaro .cookie-notice');
}

// Before running cucumber make sure the test server and webdriver are running.
// The test server is started by the test script in package.json.
// The web driver is started in this before block.
BeforeAll(async() => {
  await startBrowser();
  await warmupBrowser();
});

Before({ tags: '@klaro-notice-not-dismissed' }, async() => {
  await runners.haveNotYetAcceptedKlaroCookies();
});

Before({ tags: 'not @klaro-notice-not-dismissed' }, async() => {
  await runners.havePreviouslyAcceptedKlaroCookies();
});

Before({ tags: '@debug-apirequests-not-enabled' }, async() => {
  await runners.haveNotEnabledDebugAPIRequests();
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
