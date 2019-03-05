/**
 * @file Run Axe accessibility tests with Nightwatch-api.
 */
const { url } = require('./nightwatch.conf.js').test_settings.default.globals;

const axeOptions = {
  //verbose: true,
  reporter: 'v2',
  runOnly: {
    type: 'tag',
    values: ['wcag2aa']
  }
};

const { createSession, closeSession, startWebDriver, stopWebDriver, client } = require('nightwatch-api');
const browserEnv = process.env.browser || 'chromeHeadless';

async function setup() {
  await startWebDriver({ configFile: 'tests/a11y/nightwatch.conf.js', env: browserEnv  });
  await createSession({ configFile: 'tests/a11y/nightwatch.conf.js' });
}

async function shutdown() {
  await closeSession();
  await stopWebDriver();
}

async function run() {
  console.log('Home page');
  await client.url(`${url}/`)
    .initAccessibility()
    .assert.accessibility('body', axeOptions);
  console.log('Search page');
  await client.url(`${url}/search`)
    .initAccessibility()
    .assert.accessibility('body', axeOptions);
  console.log('Search results page');
  await client.url(`${url}/search?query=`)
    .initAccessibility()
    .assert.accessibility('body', axeOptions);
  console.log('Record page');
  await client.url(`${url}/record/2021802/1_1074991`)
    .initAccessibility()
    .assert.accessibility('body', axeOptions);
}

(async function() {
  try {
    await setup();
    await run();
  } catch (err) {
    console.log(err.stack);
  } finally {
    await shutdown();
  }
})();
