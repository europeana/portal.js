/* eslint-disable camelcase */

const percy = require('@percy/nightwatch');

function chrome(locale = 'en-GB', args = []) {
  args = [
    'disable-gpu',
    `--lang=${locale}`,
    '--allow-insecure-localhost',
    'window-size=1400,1000',
    'headless'
  ].concat(args);

  return {
    desiredCapabilities: {
      browserName: 'chrome',
      silent: true,
      chromeOptions: {
        args,
        w3c: false,
        prefs: {
          'intl.accept_languages': locale
        }
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
        url: process.env.APP_URL || 'http://localhost:3000'
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
    chrome: chrome(),
    'chrome-ja': chrome('ja'),
    'chrome-nl': chrome('nl')
  }
};
