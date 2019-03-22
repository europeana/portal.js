/**
 * @file Nightwatch interactions
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 */

const { client } = require('nightwatch-api');
const { europeanaId } = require('./europeana-identifiers.js');
const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  'home page': `${url}/`,
  'search page': `${url}/search`,
  'record page': `${url}/record${europeanaId()}`,
  'first page of results': `${url}/search?query=&page=1`
};

function qaSelector(qas) {
  return [qas]
    .flat()
    .map(qa => qa ? `[data-qa="${qa}"]` : '')
    .reverse()
    .join(' ');
}

function pageUrl(pageName) {
  return pageName.startsWith('/') ? `${url}${pageName}` : pages[pageName];
}

module.exports = {
  openAPage: async function (pageName) {
    await client.url(pageUrl(pageName));
  },
  clickOnTheTarget: async function (qas) {
    const selector = qaSelector(qas);
    await client.expect.element(selector).to.be.visible;
    await client.click(selector);
  },
  seeATarget: async function (qas) {
    await client.expect.element(qaSelector(qas)).to.be.visible;
  },
  doNotSeeATarget: async function (qas) {
    await client.expect.element(qaSelector(qas)).to.not.be.present;
  },
  seeATargetWithText: async function (qas, text) {
    await client.expect.element(qaSelector(qas)).text.to.contain(text);
  },
  waitSomeSeconds: async function (seconds) {
    await client.pause(seconds * 1000);
  },
  shouldBeOn: async function (pageName) {
    // TODO: update if a less verbose syntax becomes available.
    // See https://github.com/nightwatchjs/nightwatch/issues/861
    await client.url(async (currentUrl) => {
      await client.expect(currentUrl.value).to.eq(pageUrl(pageName));
    });
  },
  enterTextInTarget: async function (text, qa) {
    const selector = qaSelector(qa);
    await client.expect.element(selector).to.be.visible;
    await client.setValue(selector, text);
  },
  checkTheCheckbox: async function (inputValue) {
    await client.click(`input[type="checkbox"][value="${inputValue}"]`);
  }
};
