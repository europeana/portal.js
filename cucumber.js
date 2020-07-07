// Setup for cucumber environments.

module.exports = {
  'default': 'tests/features/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  'percy': 'tests/visual-regressions/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty'
};
