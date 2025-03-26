/**
 * @file Nightwatch interactions
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 */

const axios = require('axios');
const https = require('https');

const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const { pageUrl } = require('./pages');
const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

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
    await client.expect.url().to.match(new RegExp(`[?&]page=${page}([&#]|$)`));
    const inputSelector = qaSelector('pagination input');
    await client.waitForElementVisible(inputSelector);
    await client.getValue(inputSelector, async(result) => {
      await client.expect(result.value).to.equal(`${page}`);
    });
  },
  async checkPageAccesibility() {
    const axeOptions = {
      reporter: 'v2',
      runOnly: {
        type: 'tags',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
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
    const enabledSelector = `${selector}:enabled`;
    await client.expect.element(enabledSelector).to.be.present;

    await client.getAttribute(selector, 'id', async(result) => {
      const checkboxId = result.value;
      const labelSelector = `label[for="${checkboxId}"]`;
      client.click(labelSelector);
    });
  },
  async waitForTargetToHaveState(qaElementName, state) {
    const selector = qaSelector(qaElementName);
    const stateSelector = `${selector}:${state}`;
    await client.expect.element(stateSelector).to.be.present;
  },
  async switchTheTargetOnOrOff(qaElementName, onOrOff) {
    const selector = qaSelector(qaElementName);

    const wantedState = onOrOff === 'on' ? 'true' : null;
    let currentState;

    await client.getAttribute(selector, 'checked', async(result) => {
      currentState = result.value;
    });

    if (currentState !== wantedState) {
      await this.checkTheCheckbox(selector);
    }
  },
  async observeTheTargetIsSwitchedOnOrOff(qaElementName, onOrOff) {
    const selector = qaSelector(qaElementName);

    const wantedStateAttributeSelector = onOrOff === 'on' ?
      ':checked' : ':not(:checked)';

    await client.waitForElementPresent(`${selector}${wantedStateAttributeSelector}`);
  },
  async checkTheRadio(inputName, inputValue) {
    const selector = `input[type="radio"][name="${inputName}"][value="${this.escapeCssAttributeSelector(inputValue)}"]`;

    const enabledSelector = `${selector}:enabled`;
    await client.expect.element(enabledSelector).to.be.present;

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
  async clickOnTheTargetButton(qaElementNames) {
    const selector = qaSelector(qaElementNames) + ' button';
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
  seeMetadataFieldValue: async(field, value, altValue) => {
    const pattern = new RegExp(altValue ? `${value}|${altValue}` : value);
    await client.expect.element(`[data-field-name="${field}"]`).text.to.match(pattern);
  },
  async doNotSeeATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.not.be.visible;
  },
  async doNotHaveATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.not.be.present;
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
  async acceptKlaroCookies() {
    await client.expect.element('#cookie-notice-toast').to.be.visible;
    await client.click('#cookie-notice-toast .btn-success');
    await client.expect.element('#cookie-notice-toast').to.not.be.present;
  },
  async seeKlaroBanner() {
    await client.expect.element('#cookie-notice-toast').to.be.visible;
  },
  async notSeeKlaroBanner() {
    await client.expect.element('#cookie-notice-toast').to.not.be.present;
  },
  async seeKeycloakLoginForm() {
    await client.expect.element('.kcform').to.be.visible;
  },
  async havePreviouslyAcceptedKlaroCookies() {
    // Only sets Klaro cookie, not the actual selected cookies
    await client.setCookie({
      name: 'klaro',
      value: ''
    });
  },
  async haveNotYetAcceptedKlaroCookies() {
    await client.deleteCookie('klaro');
  },
  async paginateToPage(page) {
    const containerSelector = qaSelector('search results pagination');

    await client.waitForElementVisible(containerSelector);
    const selector = containerSelector + ' ' + qaSelector('pagination input');
    await client.waitForElementVisible(selector);
    // Double clearing the input as a workaround to an issue on collection pages,
    // where the first clear results in a redirect to page 1.
    await client.clearValue(selector);
    await client.clearValue(selector);
    await client.setValue(selector, [`${page}`, client.Keys.ENTER]);
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
  async seeACheckedInput(value, name, type) {
    const selector = `input[type="${type}"][name="${name}"][value="${value}"]:checked`;

    await client.expect.element(selector).to.be.present;
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
  async haveHighlightedATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames) + ':focus').to.be.visible;
  },
  async haveEnabledButtonInTarget(qaElementName) {
    await client.waitForElementVisible(qaSelector(qaElementName) + ' button:enabled');
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
    await client.setCookie({
      name: 'searchResultsView',
      value: viewName
    });
  },
  async doNotSeeTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
    await client.waitForElementVisible(selector);
    await client.getValue(selector, async(result) => {
      await client.expect(result.value).to.not.eq(text);
    });
  },
  async shouldBeOn(pageName) {
    await client.expect.url().to.eq(pageUrl(pageName));
  },
  async shouldNotBeOn(pageName) {
    await client.expect.url().not.to.eq(pageUrl(pageName));
  },
  async waitSomeSeconds(seconds) {
    await client.pause(seconds * 1000);
  },
  async waitForTargetToBeVisible(qaElementName) {
    await client.waitForElementVisible(qaSelector(qaElementName));
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
    // For consistency always wait a full second before taking a percy snapshot,
    // this allows any JS based resizing/loading/animations from previous steps to finish.
    await this.waitSomeSeconds(1);

    await client.percySnapshot(pageName);
  },
  async hrefLangTags() {
    await client.expect.element('link[rel=alternate]').to.be.present;
  },
  async haveEuropeanaBrandedTitle() {
    await client.getTitle(async(title) => {
      await client.expect(title).to.match(new RegExp('\\| Europeana$'));
    });
  },
  async doNotHaveEuropeanaBrandedTitle() {
    await client.getTitle(async(title) => {
      await client.expect(title).not.to.match(new RegExp('\\| Europeana$'));
    });
  },
  async haveNotExcededMemoryUsageInMB(memoryUsageMB) {
    const response = await axios.get(`${url}/_api/debug/memory-usage`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    const heapUsed = response.data.heapUsed;
    const heapUsedMB = heapUsed / (1024 * 1024);
    await client.expect(heapUsedMB).to.be.at.most(memoryUsageMB);
  },
  async moveToElement(qaElementName) {
    await client.moveToElement(qaSelector(qaElementName), 10, 10);
  },
  async isActive(qaElementName) {
    await client.expect.element(qaSelector(qaElementName)).to.be.active;
  },
  async scrollWindow() {
    await client.execute('scroll(0, 100)');
  },
  async resizeBrowserWindow(width, height) {
    await client.resizeWindow(width, height);
  },
  async iframeFitsContainer(qaElementNameParent) {
    let childSize;
    let parentSize;
    await client.getElementSize(`${qaSelector(qaElementNameParent)} iframe`, (result) => {
      childSize = { height: result.value.height, width: result.value.width };
    });
    await client.getElementSize(qaSelector(qaElementNameParent), (result) => {
      parentSize = { height: result.value.height, width: result.value.width };
    });
    await client.expect(childSize.height).to.be.at.most(parentSize.height);
    await client.expect(childSize.width).to.be.at.most(parentSize.width);
  },
  async takeScreenshot(filename) {
    await client.saveScreenshot(`./screenshots/${filename}.png`);
  }
};
