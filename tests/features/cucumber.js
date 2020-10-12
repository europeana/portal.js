// Setup for cucumber environments.

module.exports = {
  default: '--require ./config/cucumber.conf.js --format node_modules/cucumber-pretty',
  all: './**/*.feature --require ./config/cucumber.conf.js --format node_modules/cucumber-pretty'
};
