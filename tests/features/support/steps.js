/**
 * @file Cucumber step definitions for Nightwatch
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 * @see {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/step_definitions.md|Cucumber JS step definitions}
 */

const { client } = require('nightwatch-api');
const { defineStep } = require('cucumber');

const { nestedSelector } = require('./nested-selector.js');
const { europeanaId } = require('./europeana-identifiers.js');

const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  'home page': `${url}/`,
  'search page': `${url}/search`,
  'record page': `${url}/record${europeanaId()}`,
  'first page of results': `${url}/search?query=&page=1`
};

defineStep(/^I (?:browse|open|visit).*? `(.*?)`$/, pageName => {
  if (pageName.startsWith('/')) {
    client.url(`${url}${pageName}`);
  } else {
    client.url(pages[pageName]);
  }
});

defineStep(/^I (?:find|identify|see|spot).*? (`.*`)$/, selectorChain =>
  client.expect.element(nestedSelector(selectorChain)).to.be.visible);

defineStep(/^I (?:find|identify|see|spot).*? (`.*`) with the text "(.*)"$/, (selectorChain, value) =>
  client.expect.element(nestedSelector(selectorChain)).text.to.contain(value));

defineStep(/^I (?:can|don)'t (?:find|identify|see|spot).*? (`.*`).*?$/, selectorChain =>
  client.expect.element(nestedSelector(selectorChain)).to.not.be.present);

defineStep(/^I (?:wait|pause) (\d+) seconds?$/, async (waitSeconds) => {
  await client.pause(waitSeconds * 1000);
});

defineStep(/^I (?:enter|fill|input|supply|type).*? "(.*?)" in.*? (`.*`)$/, async (value, selectorChain) => {
  await client.expect.element(nestedSelector(selectorChain)).to.be.visible;
  await client.setValue(nestedSelector(selectorChain), value);
});

defineStep(/^I (?:activate|click).*? (`.*`)$/, async(selectorChain) => {
  await client.expect.element(nestedSelector(selectorChain)).to.be.visible;
  await client.click(nestedSelector(selectorChain));
});

defineStep(/^I (?:check|click).*? "(.*)" checkbox$/, inputValue =>
  client.click(`input[type="checkbox"][value="${inputValue}"]`));

defineStep(/^I should be on.*? `(.*)`$/, async(pageName) => {
  let expectedUrl;
  if (pageName.startsWith('/')) {
    expectedUrl = `${url}${pageName}`;
  } else {
    expectedUrl = pages[pageName];
  }
  // TODO: update if a less verbose syntax becomes available.
  // See https://github.com/nightwatchjs/nightwatch/issues/861
  await client.url(currentUrl => {
    client.expect(currentUrl.value).to.eq(expectedUrl);
  });
});
