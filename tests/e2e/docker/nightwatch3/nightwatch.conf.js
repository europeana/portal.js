// Refer to the online docs for more details:
// https://nightwatchjs.org/gettingstarted/configuration/
//

//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ['test/features/step_definitions'],

  // See https://nightwatchjs.org/guide/concepts/page-object-model.html
  page_objects_path: ['pages'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
  custom_commands_path: [],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
  custom_assertions_path: [],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: [],

  // See https://nightwatchjs.org/guide/concepts/test-globals.html
  globals_path: '',

  webdriver: {},

  test_workers: {
    enabled: true
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'https://nginx',

      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },

      selenium: {
        host: 'selenium',
        port: 4444
      },

      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        acceptInsecureCerts: true
      },

      // webdriver: {
      //   start_process: true,
      //   server_path: ''
      // },

      test_runner: {
        // set cucumber as the runner
        // For more info on using CucumberJS with Nightwatch, visit:
        // https://nightwatchjs.org/guide/writing-tests/using-cucumberjs.html
        type: 'cucumber',

        // define cucumber specific options
        options: {
          //set the feature path
          feature_path: 'test/features',

          // start the webdriver session automatically (enabled by default)
          // auto_start_session: true

          // use parallel execution in Cucumber
          // parallel: 2 // set number of workers to use (can also be defined in the cli as --parallel 2
        }
      }
    },

    // chrome: {
    //   desiredCapabilities: {
    //     browserName: 'chrome',
    //     'goog:chromeOptions': {
    //       // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
    //       //
    //       // w3c:false tells Chromedriver to run using the legacy JSONWire protocol (not required in Chrome 78)
    //       w3c: true,
    //       args: [
    //         //'--no-sandbox',
    //         //'--ignore-certificate-errors',
    //         //'--allow-insecure-localhost',
    //         //'--headless'
    //       ]
    //     }
    //   },
    //
    //   webdriver: {
    //     start_process: true,
    //     server_path: '',
    //     cli_args: [
    //       // --verbose
    //     ]
    //   }
    // },

  },

};
