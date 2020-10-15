/**
 * @file Nightwatch interactions
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 */

const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const { pageUrl } = require('./pages');

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

module.exports = {
  async amOnPageNumber(page) {
    await client.url(async(currentUrl) => {
      const pageFromUrl = await new URL(currentUrl.value).searchParams.get('page');
      await client.expect(Number(pageFromUrl)).to.eq(page);
    });
    const navSelector = qaSelector('pagination navigation');
    const activeLinkSelector = navSelector + ` li.active a[aria-posinset="${page}"]`;
    await client.waitForElementVisible(activeLinkSelector);
  },
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
  escapeCssAttributeSelector(selector) {
    return selector.replace(/"/g, '\\"');
  },
  async checkTheCheckboxWithNameAndValue(inputName, inputValue) {
    const selector = `input[type="checkbox"][name="${inputName}"][value="${this.escapeCssAttributeSelector(inputValue)}"]`;
    await this.checkTheCheckbox(selector);
  },
  async checkTheCheckbox(selector) {
    await client.getAttribute(selector, 'id', async(result) => {
      const checkboxId = result.value;
      const labelSelector = `label[for="${checkboxId}"]`;
      client.click(labelSelector);
    });
  },
  async switchTheTargetOnOrOff(qaElementName, onOrOff) {
    const selector = qaSelector(qaElementName);

    const wantedState = onOrOff === 'on' ? 'true' : null;
    let currentState;

    await client.getAttribute(selector, 'checked', async(result) => {
      currentState = result.value;
    });

    if (currentState !== wantedState) await this.checkTheCheckbox(selector);
  },
  async observeTheTargetIsSwitchedOnOrOff(qaElementName, onOrOff) {
    const selector = qaSelector(qaElementName);

    const wantedStateAttributeSelector = onOrOff === 'on' ?
      ':checked' : ':not(:checked)';

    await client.waitForElementPresent(`${selector}${wantedStateAttributeSelector}`);
  },
  async checkTheRadio(inputName, inputValue) {
    const selector = `input[type="radio"][name="${inputName}"][value="${this.escapeCssAttributeSelector(inputValue)}"]`;
    await client.getAttribute(selector, 'id', (result) => {
      const radioId = result.value;
      const labelSelector = `label[for="${radioId}"]`;
      client.click(labelSelector);
    });
  },
  async clickOnTheTarget(qaElementNames) {
    const selector = qaSelector(qaElementNames);
    await client.waitForElementVisible(selector);
    await client.click(selector);
  },
  async clickOnLink(href) {
    const selector = `a[href="${href}"]`;
    await client.waitForElementVisible(selector);
    client.click(selector);
  },
  countTarget: async(count, qaElementNames) => {
    await client.elements('css selector', qaSelector(qaElementNames), async(result) => {
      await client.expect(result.value).to.have.lengthOf(count);
    });
  },
  countTargetByNameAttribute: async(count, inputName) => {
    const inputSelector = `input[name="${inputName}"]`;
    await client.elements('css selector', inputSelector, async(result) => {
      await client.expect(result.value).to.have.lengthOf(count);
    });
  },
  pressKey: async(key) => {
    if (key.length > 1) {
      key = client.Keys[key];
    }
    client.keys(key);
  },
  matchMetaLabelAndValue: async(label, value) => {
    await client.elements('xpath', '//label[contains(text(),"' + label + '")]/parent::div//ul/li[contains(text(),"' + value + '")]', async(result) => {
      await client.expect(result.value).to.have.lengthOf(1);
    });
  },
  matchMetaLabelAndValueOrValue: async(label, value, altValue) => {
    await client.elements('xpath', '//label[contains(text(),"' + label + '")]/parent::div//ul/li[contains(text(),"' + value + '") or contains(text(),"' + altValue + '")]', async(result) => {
      await client.expect(result.value).to.have.lengthOf(1);
    });
  },
  doNotSeeATarget(qaElementNames) {
    client.expect.element(qaSelector(qaElementNames)).to.not.be.visible;
  },
  doNotHaveATarget(qaElementNames) {
    client.expect.element(qaSelector(qaElementNames)).to.not.be.present;
  },
  async enterTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
    await client.clearValue(selector);
    await client.waitForElementVisible(selector);
    await client.setValue(selector, text);
  },
  async observeTargetHasClass(qaElementName, klass) {
    await client.getAttribute(qaSelector(qaElementName), 'class', async(result) => {
      await client.expect(result.value.split(' ')).to.include(klass);
    });
  },
  async openAPage(pageName) {
    await client.url(pageUrl(pageName));
  },
  async acceptCookies() {
    await client.expect.element('.cookie-disclaimer').to.be.visible;
    await client.click('.cookie-disclaimer .accept-btn');
    await client.expect.element('.cookie-disclaimer').to.not.be.visible;
  },
  async havePreviouslyAcceptedCookies() {
    /* eslint-disable prefer-arrow-callback */
    /* DO NOT MAKE INTO A ARROW FUNCTION - If you do, it will break the tests */
    await client.execute(function() {
      localStorage.cookieConsent = 'accepted';
    }, []);
    /* eslint-enable prefer-arrow-callback */
  },
  async haveNotYetAcceptedCookies() {
    /* eslint-disable prefer-arrow-callback */
    /* DO NOT MAKE INTO A ARROW FUNCTION - If you do, it will break the tests */
    await client.execute(function() {
      localStorage.cookieConsent = null;
    }, []);
    /* eslint-enable prefer-arrow-callback */
  },
  async haveNotEnabledDebugAPIRequests() {
    /* eslint-disable prefer-arrow-callback */
    /* DO NOT MAKE INTO A ARROW FUNCTION - If you do, it will break the tests */
    await client.execute(function() {
      localStorage.debugSettings = null;
    }, []);
    /* eslint-enable prefer-arrow-callback */
  },
  async paginateToPage(page) {
    const containerSelector = qaSelector('pagination navigation');

    // Move down to the nav container and wait one second to allow lazy-loading
    // of images which may interfere with clicking on pagination.
    // FIXME: this is not 100% reliable
    await client.moveToElement(containerSelector, 0, 0);
    await this.waitSomeSeconds(1);

    await client.waitForElementVisible(containerSelector);
    const selector = containerSelector + ` a[aria-posinset="${page}"]`;
    await client.waitForElementVisible(selector);

    await client.click(selector);
  },
  async preferBrowserLanguage(locale) {
    const nightwatchApiOptions = {
      configFile: 'config/nightwatch.conf.js',
      env: `chrome-${locale}`,
      silent: true
    };

    await closeSession();
    await stopWebDriver();

    await startWebDriver(nightwatchApiOptions);
    await createSession(nightwatchApiOptions);
  },
  async seeACheckedRadio(inputName, inputValue) {
    const radioSelector = `input[type="radio"][name="${inputName}"][value="${inputValue}"]:checked`;

    await client.expect.element(radioSelector).to.be.present;
  },
  async seeALinkInTarget(linkHref, qaElementName) {
    await client.expect.element(qaSelector(qaElementName) + ` a[href="${linkHref}"]`).to.be.visible;
  },
  async seeATarget(qaElementNames) {
    const selector = qaSelector(qaElementNames);
    await client.expect.element(selector).to.be.visible;
  },
  async seeATargetWithText(qaElementNames, text) {
    await client.expect.element(qaSelector(qaElementNames)).text.to.contain(text);
  },
  async seeASectionHeadingWithText(headingLevel, text) {
    await client.expect.element(`h${headingLevel}`).text.to.contain(text);
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
  },
  async waitForThePageToLoad() {
    await client.waitForElementPresent('.nuxt-progress');
    await client.waitForElementNotPresent('.nuxt-progress');
  },
  async goBack() {
    await client.back();
  },
  async searchFor(query) {
    await this.waitForTargetToBeVisible('search box');
    await this.enterTextInTarget(query, 'search box');
    await this.clickOnTheTarget('search button');
  },
  async makeSnapShot(pageName) {
    await client.percySnapshot(pageName);
  },
  async hrefLangTags() {
    await client.expect.element('link[rel=alternate]').to.be.present;
  }
};
