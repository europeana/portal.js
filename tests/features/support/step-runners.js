/**
 * @file Nightwatch interactions
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 */

const { client } = require('nightwatch-api');
const { europeanaId } = require('./europeana-identifiers.js');
const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  'home page': `${url}/`,
  'search page': `${url}/search?query=`,
  'record page': `${url}/record${europeanaId()}`,
  'first page of results': `${url}/search?query=&page=1`,
  'entity page': `${url}/entity/person/200-friedrich-nietzsche`
};

/**
 * Generate CSS selector for `data-qa` attribute values.
 * Given a scalar argument a single selector will be returned.
 * Given an array as argument, a descendant selector will be generated, <em>for
 * the reverse order of the elements</em>, i.e. last element is the ancestor,
 * first is the descendant.
 * @param {(string|string[])} qaElementNames one or more `data-qa` attribute values
 * @return {string} CSS selector
 */
function qaSelector(qaElementNames) {
  return [qaElementNames]
    .flat()
    .map(name => name ? `[data-qa="${name}"]` : '')
    .reverse()
    .join(' ');
}

function pageUrl(pageName) {
  return pageName.startsWith('/') ? `${url}${pageName}` : pages[pageName];
}

module.exports = {
  async checkPageAccesibility() {
    let axeOptions = {
      reporter: 'v2',
      runOnly: {
        type: 'tags',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'aria-roles': { enabled: false } // https://github.com/bootstrap-vue/bootstrap-vue/issues/2921 + https://github.com/dequelabs/axe-core/issues/1462
      }
    };

    await client.initAccessibility().assert.accessibility('html', axeOptions);
  },
  async checkTheCheckbox(inputValue) {
    await client.click(`input[type="checkbox"][value="${inputValue}"]`);
  },
  async checkTheRadio(inputValue) {
    await client.click(`input[type="radio"][value="${inputValue}"]`);
  },
  async clickOnTheTarget(qaElementNames) {
    const selector = qaSelector(qaElementNames);
    await client.waitForElementVisible(selector);
    await client.click(selector);
  },
  async clickOnLink(href) {
    const selector = `a[href="${href}"]`;
    await client.waitForElementVisible(selector);
    await client.click(selector);
  },
  countTarget: async(count, qaElementNames) => {
    await client.elements('css selector', qaSelector(qaElementNames), async(result) => {
      await client.expect(result.value).to.have.lengthOf(count);
    });
  },
  pressKey: async(key) => {
    if (key.length > 1) {
      key = client.Keys[key];
    }
    await client.keys(key);
  },
  matchMetaLabelAndValue: async(label, value) => {
    await client.elements('xpath', '//strong[contains(text(),"' + label + '")]/parent::div/parent::div//span[contains(text(),"' + value + '")]', async(result) => {
      await client.expect(result.value).to.have.lengthOf(1);
    });
  },
  matchMetaLabelAndValueOrValue: async(label, value, altValue) => {
    await client.elements('xpath', '//strong[contains(text(),"' + label + '")]/parent::div/parent::div//span[contains(text(),"' + value + '") or contains(text(),"' + altValue + '")]', async(result) => {
      await client.expect(result.value).to.have.lengthOf(1);
    });
  },
  async doNotSeeATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.not.be.present;
  },
  async enterTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
    await client.waitForElementVisible(selector);
    await client.setValue(selector, text);
  },
  async openAPage(pageName) {
    await client.url(pageUrl(pageName));
  },
  async seeALinkInTarget(linkHref, qaElementName) {
    await client.expect.element(qaSelector(qaElementName) + ` a[href="${linkHref}"]`).to.be.visible;
  },
  async seeATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.be.visible;
  },
  async seeATargetWithText(qaElementNames, text) {
    await client.expect.element(qaSelector(qaElementNames)).text.to.contain(text);
  },
  async seeTextInTargetPlaceholder(text, qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.have.attribute('placeholder').to.contain(text);
  },
  async seeTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
    await client.getValue(selector, async(result) => {
      await client.expect(result.value).to.eq(text);
    });
  },
  async selectSearchResultsView(viewName) {
    /* eslint-disable prefer-arrow-callback */
    /* DO NOT MAKE INTO A ARROW FUNCTION - If you do, it will break the tests */
    await client.execute(function(viewName) {
      localStorage.searchResultsView = viewName;
      sessionStorage.searchResultsView = viewName;
      return true;
    }, [viewName]);
    /* eslint-enable prefer-arrow-callback */
  },
  async doNotSeeTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
    await client.waitForElementVisible(selector);
    await client.getValue(selector, async(result) => {
      await client.expect(result.value).to.not.eq(text);
    });
  },
  async shouldBeOn(pageName) {
    // TODO: update if a less verbose syntax becomes available.
    // See https://github.com/nightwatchjs/nightwatch/issues/861
    await client.url(async(currentUrl) => {
      await client.expect(currentUrl.value).to.eq(pageUrl(pageName));
    });
  },
  async shouldNotBeOn(pageName) {
    await client.url(async(currentUrl) => {
      await client.expect(currentUrl.value).not.to.eq(pageUrl(pageName));
    });
  },
  async waitSomeSeconds(seconds) {
    await client.pause(seconds * 1000);
  },
  async waitForTargetToBeVisible(qaElementName) {
    await client.waitForElementVisible(qaSelector(qaElementName));
  }
};
