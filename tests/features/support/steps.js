const { client } = require('nightwatch-api');
const { Given, Then } = require('cucumber');

const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  'home page': `${url}/`,
  'search page': `${url}/search`
};

const elements = {
  'search box': '[data-qa="search query input"]',
  'submit button': '[data-qa="search submit button"]',
  'header': '[data-qa="header"]',
  'header logo': '[data-qa="header logo"]',
  'title': 'h1.title', // replace with data-qa selector
  'browse section': '[data-qa="browse section"]',
  'browse card': '[data-qa="browse card"]'
};

Given(/^I open the `(.*?)`$/, pageName => {
  console.log(client.sessionId);
  client.url(pages[pageName]);
});

Then(/^I see.*? `(.*?)`.*?$/, elementName =>
  client.expect.element(elements[elementName]).to.be.visible);

Then(/^I don't see.*? `(.*?)`.*?$/, elementName =>
  client.expect.element(elements[elementName]).to.not.be.visible);

Then(/^I enter.*? "(.*?)" into `(.*?)`$/, (value, elementName) =>
  client.setValue(elements[elementName], value));

Then(/^I click.*? `(.*?)`$/, elementName =>
  client.click(elements[elementName]));
