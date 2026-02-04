/* eslint-disable no-console */

const { setDefaultTimeout, After, AfterAll, Before, BeforeAll } = require('cucumber');
const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const runners = require('../support/step-runners');

require('../support/step-definitions');
const browserDimensions = require('./defaults.conf.js').browserDimensions;

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

  // Optionally take a screenshot of the warmup page
  process.env.NIGHTWATCH_SCREENSHOTS && await client.saveScreenshot('./screenshots/warmup.png');

  await client.waitForElementVisible('#cookie-notice-toast');
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

After(async() => {
  await client.deleteCookies();
});

After({ tags: '@non-default-browser' }, async() => {
  // Restore default browser config
  await stopBrowser();
  await startBrowser();
  await warmupBrowser();
});

After({ tags: '@resized-browser' }, async() => {
  // Restore default browser size
  await runners.resizeBrowserWindow(browserDimensions.width, browserDimensions.height);
});

AfterAll(async() => {
  await stopBrowser();
});
