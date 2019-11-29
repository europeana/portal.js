/**
 * @file Nightwatch interactions
 * @see {@link http://nightwatchjs.org/api#expect-api|Nightwatch Expect assertions}
 */

const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const { europeanaId } = require('./europeana-identifiers.js');
const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  'home page': `${url}/en`,
  'English home page': `${url}/en`,
  'Swedish home page': `${url}/sv`,
  'exhibition page': `${url}/en/exhibition/the-pink-flowers`,
  'exhibition chapter': `${url}/en/exhibition/the-pink-flowers/allium`,
  'exhibitions page': `${url}/en/exhibitions`,
  'search page': `${url}/en/search?query=`,
  'record page': `${url}/en/record${europeanaId()}`,
  'record page without isShownBy or hasView': `${url}/en/record/9200102/BibliographicResource_3000134083514`,
  '"The Milkmaid" record page': `${url}/en/record/90402/SK_A_2344`,
  '"Het laatste avondmaal" record page': `${url}/en/record/90402/RP_P_OB_70_879`,
  '"Hammerflügel" record page': `${url}/en/record/09102/_GNM_693983`,
  '"The pride of Glencoe, song" record page': `${url}/en/record/2059213/data_sounds_455`,
  'first page of results': `${url}/en/search?query=&page=1`,
  'entity page': `${url}/en/entity/topic/18-newspaper`,
  '"World War I" entity page': `${url}/en/entity/topic/83-world-war-i`,
  'blog page': `${url}/en/blog`
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
  async amOnPageNumber(page) {
    await client.url(async(currentUrl) => {
      const pageFromUrl = await new URL(currentUrl.value).searchParams.get('page');
      await client.expect(Number(pageFromUrl)).to.eq(page);
    });
    const navSelector = qaSelector('pagination navigation');
    const activeLinkSelector = navSelector + ` li.active a[aria-posinset="${page}"]`;
    await client.expect.element(activeLinkSelector).to.be.visible;
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
  async checkTheCheckbox(inputName, inputValue) {
    const checkboxSelector = `input[type="checkbox"][name="${inputName}"][value="${inputValue}"]`;
    await client.getAttribute(checkboxSelector, 'id', (result) => {
      const checkboxId = result.value;
      const labelSelector = `label[for="${checkboxId}"]`;
      client.click(labelSelector);
    });
  },
  async checkTheRadio(inputName, inputValue) {
    const checkboxSelector = `input[type="radio"][name="${inputName}"][value="${inputValue}"]`;
    await client.getAttribute(checkboxSelector, 'id', (result) => {
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
    await client.click(selector);
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
    await client.keys(key);
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
  async doNotSeeATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.not.be.visible;
  },
  async doNotHaveATarget(qaElementNames) {
    await client.expect.element(qaSelector(qaElementNames)).to.not.be.present;
  },
  async enterTextInTarget(text, qaElementName) {
    const selector = qaSelector(qaElementName);
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
  async paginateToPage(page) {
    const selector = qaSelector('pagination navigation') + ` a[aria-posinset="${page}"]`;
    await client.click(selector);
  },
  async preferBrowserLanguage(locale) {
    const browserEnv = (process.env.browser || 'gecko') + `-${locale}`;
    const nightwatchApiOptions = {
      configFile: 'tests/features/config/nightwatch.conf.js',
      env: browserEnv,
      silent: true
    };

    await closeSession();
    await stopWebDriver();

    await startWebDriver(nightwatchApiOptions);
    await createSession(nightwatchApiOptions);
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
  async goBack() {
    await client.back();
  },
  async searchFor(query) {
    await this.enterTextInTarget(query, 'search box');
    await this.clickOnTheTarget('search button');
  }
};
