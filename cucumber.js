// ~/cucumber.js

module.exports = {
  'default': '--require tests/features/config/cucumber.conf.js --require tests/features --format node_modules/cucumber-pretty',
  'all':  'tests/features/**/*.feature --require tests/features/config/cucumber.conf.js --require tests/features --format node_modules/cucumber-pretty'
};
