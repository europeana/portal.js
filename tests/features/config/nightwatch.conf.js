/* eslint-disable camelcase */

const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

module.exports = {
  output: false,
  test_settings: {
    default: {
      globals: {
        url: 'http://localhost:1337'
      },
      webdriver: {
        start_process: true,
        port: 4444,
        cli_args: ['--port=4444', '--log', 'debug']
      },
      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },
    chrome: {
      webdriver: {
        server_path: chromedriver.path
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-gpu']
        }
      }
    },
    chromeHeadless: {
      webdriver: {
        server_path: chromedriver.path
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-gpu', 'headless']
        }
      }
    },
    gecko: {
      webdriver: {
        server_path: geckodriver.path
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }
  }
};
