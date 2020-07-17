// Setup for cucumber environments.

module.exports = {
  all: 'tests/features/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  collections: 'tests/features/collections/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  common: 'tests/features/common/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  default: '--require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  pages: 'tests/features/pages/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  search: 'tests/features/search/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty',
  visual: 'tests/features/visual/**/*.feature --require tests/features/config/cucumber.conf.js --format node_modules/cucumber-pretty'
};
