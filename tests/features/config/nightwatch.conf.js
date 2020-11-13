/* eslint-disable camelcase */

const percy = require('@percy/nightwatch');

function chrome(options = {}) {
  const args = [
    'disable-gpu',
    `--lang=${options.locale}`,
    '--allow-insecure-localhost',
    'window-size=1400,1000',
    '--no-sandbox',
    'headless'
  ];

  return {
    webdriver: {
      host: options.host
    },
    desiredCapabilities: {
      browserName: 'chrome',
      silent: true,
      chromeOptions: {
        args,
        w3c: false
      }
    }
  };
}

module.exports = {
  custom_commands_path: [percy.path, './node_modules/nightwatch-accessibility/commands'],
  custom_assertions_path: ['./config/assertions'],
  test_settings: {
    default: {
      globals: {
        url: process.env.APP_URL || 'http://localhost:3000',
        testUser: process.env.TEST_USER_NAME || 'tester@europeana.eu',
        testPassword: process.env.TEST_USER_PASSWORD || 'password'
      },
      webdriver: {
        host: process.env.WEBDRIVER_HOST,
        start_process: false,
        port: 4444
      },
      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true,
        acceptInsecureCerts: true
      }
    },
    'chrome-en': chrome({
      locale: 'en-GB',
      host: process.env.WEBDRIVER_EN_HOST
    }),
    'chrome-ja': chrome({
      locale: 'ja-JP',
      host: process.env.WEBDRIVER_JA_HOST
    }),
    'chrome-nl': chrome({
      locale: 'nl-NL',
      host: process.env.WEBDRIVER_NL_HOST
    })
  }
};
