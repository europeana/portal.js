/**
 * @file Cucumber step definitions for Nightwatch
 * @see {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/step_definitions.md|Cucumber JS step definitions}
 */

const { defineStep, defineParameterType } = require('cucumber');
const i = require('./step-runners');

defineParameterType({
  name: 'target',
  regexp: /`[^`]+`/,
  transformer: (value) => {
    return value.slice(1, -1);
  }
});

defineStep('I accept all Klaro cookies', () =>
  i.acceptKlaroCookies());

defineStep('I see the Klaro banner', () =>
  i.seeKlaroBanner());

defineStep('I do not see the Klaro banner', () =>
  i.notSeeKlaroBanner());

defineStep('I browse/open/visit (a/an/the)( ){target}', (pageName) =>
  i.openAPage(pageName));

defineStep('I am on (a/an/the)( ){target}', (pageName) =>
  i.openAPage(pageName));

defineStep('I find/identify/see/spot (a/an/the)( ){target}', (qa) =>
  i.seeATarget(qa));

defineStep('I see the Keycloak login form', () =>
  i.seeKeycloakLoginForm());

defineStep('I find/identify/see/spot (a/an/the)( ){target} in/on a/an/the {target}', (qa, parentQa) =>
  i.seeATarget([qa, parentQa]));

defineStep('I find/identify/see/spot (a/an/the)( ){target} with the text {string}', (qa, text) =>
  i.seeATargetWithText(qa, text));

defineStep('(a/an/the)( ){target} is/are highlighted', (qa) =>
  i.haveHighlightedATarget(qa));

defineStep('the memory used is less than {int} MB', memoryUsageMB => {
  i.haveNotExcededMemoryUsageInMB(memoryUsageMB);
});

defineStep('I refresh the page', () => {
  i.refreshThePage();
});

defineStep('I find/identify/see/spot (a/an/the)( )level {int} (section )heading with the text {string}', (headingLevel, text) =>
  i.seeASectionHeadingWithText(headingLevel, text));

defineStep('I can\'t/don\'t find/identify/see/spot (a/an/the)( ){target}', (qa) =>
  i.doNotSeeATarget(qa));

defineStep('I can\'t/don\'t have (a/an/the)( ){target}', (qa) =>
  i.doNotHaveATarget(qa));

defineStep('there are/is no (a/an/the)( ){target}', (qa) =>
  i.doNotHaveATarget(qa));

defineStep('the {string} {word} {word} is checked', i.seeACheckedInput);

defineStep('I can\'t/don\'t have (a/an/the)( ){target} in/on the {target}', (qa, parentQa) =>
  i.doNotHaveATarget([qa, parentQa]));

defineStep('I wait/pause {int} second(s)', (seconds) =>
  i.waitSomeSeconds(seconds));

defineStep('I press/hit/type the {word} key', (key) =>
  i.pressKey(key));

defineStep('I enter/fill/input/supply/type {string} in/on (the ){target}', (text, qa) =>
  i.enterTextInTarget(text, qa));

defineStep('I find/identify/see/spot {string} in/on (the ){target}', (text, qa) =>
  i.seeTextInTarget(text, qa));

defineStep('I can\'t/don\'t find/identify/see/spot {string} in/on (the ){target}', (text, qa) =>
  i.doNotSeeTextInTarget(text, qa));

defineStep('I activate/click (the/a/an)( ){target}', (qa) =>
  i.clickOnTheTarget(qa));

defineStep('I activate/click (the/a/an)( ){target} button', (qa) =>
  i.clickOnTheTargetButton(qa));

defineStep('the/a/an {target} is/are {string}', i.waitForTargetToHaveState);

defineStep('I activate/click (on )(the/a/an)( ){target} in/on a/an/the {target}', (qa, parentQa) =>
  i.clickOnTheTarget([qa, parentQa]));

defineStep('I check/click the {string} {string} checkbox', (inputValue, inputName) =>
  i.checkTheCheckboxWithNameAndValue(inputName, inputValue));

// TODO: new parameter type for on or off?
defineStep('I switch the {target} {word}', (qa, onOrOff) =>
  i.switchTheTargetOnOrOff(qa, onOrOff));

defineStep('the {target} is switched {word}', (qa, onOrOff) =>
  i.observeTheTargetIsSwitchedOnOrOff(qa, onOrOff));

defineStep('I check/click the {string} {string} radio', (inputValue, inputName) =>
  i.checkTheRadio(inputName, inputValue));

defineStep('I activate/click/follow (the/a/an)( ){string} link', (href) =>
  i.clickOnLink(href));

defineStep('the {target} is/are marked (as ){string}', (qa, klass) =>
  i.observeTargetHasClass(qa, klass));

defineStep('I should be on (the ){target}', (pageName) =>
  i.shouldBeOn(pageName));

defineStep('I should not be on (the ){target}', (pageName) =>
  i.shouldNotBeOn(pageName));

defineStep('I wait for (a/an/the)( ){target}', (qa) =>
  i.waitForTargetToBeVisible(qa));

defineStep('I find/identify/see/spot a link to {string} in (a/an/the)( ){target}', (linkHref, qa) =>
  i.seeALinkInTarget(linkHref, qa));

defineStep('I find/identify/see/spot the text {string} in (a/an/the)( ){target} placeholder', (text, qa) =>
  i.seeTextInTargetPlaceholder(text, qa));

defineStep('I should have/see/see/spot {int} {target}(s)', (count, qa) =>
  i.countTarget(count, qa));

defineStep('I should see {int} {word} checkboxes/radio( )(buttons)', (count, inputName) =>
  i.countTargetByNameAttribute(count, inputName));

defineStep('I should have/see/see/spot a metadata field for {word} with the value {string}', (field, value) =>
  i.seeMetadataFieldValue(field, value));

defineStep('I should have/see/see/spot a metadata field for {word} with the value {string} or the value {string}', (field, value, altValue) =>
  i.seeMetadataFieldValue(field, value, altValue));

defineStep('I have selected/chosen (the ){target} search results view', (viewName) =>
  i.selectSearchResultsView(viewName));

defineStep('I am on an accessible page', () =>
  i.checkPageAccesibility());

defineStep('I paginate/switch/go to page (number ){int}', (page) =>
  i.paginateToPage(page));

defineStep('I am on page (number ){int}', (page) =>
  i.amOnPageNumber(page));

defineStep('I go back', () =>
  i.goBack());

defineStep('my browser accepts the language {string}', (locale) =>
  i.preferBrowserLanguage(locale));

defineStep('I search for {string}', (query) =>
  i.searchFor(query));

defineStep('I make a snapshot of (a/an/the)( ){target}', (pageName) =>
  i.makeSnapShot(pageName));

defineStep('I should see alternate-hreflang tags', () =>
  i.hrefLangTags());

defineStep('I should have a Europeana branded page title', () =>
  i.haveEuropeanaBrandedTitle());

defineStep('I should not have a Europeana branded page title', () =>
  i.doNotHaveEuropeanaBrandedTitle());

defineStep('I hover over (a/an/the)( ){target}', (target) =>
  i.moveToElement(target));

defineStep('The {target} is active', (qa) =>
  i.isActive(qa));

defineStep('I scroll the page', () =>
  i.scrollWindow());

defineStep('I resize the window to {int} by {int}', (width, height) =>
  i.resizeBrowserWindow(width, height));

defineStep('The iframe does not overflow {target}', (parent) =>
  i.iframeFitsContainer(parent));

defineStep('I take a screenshot( named) {string}', (filename) =>
  i.takeScreenshot(filename));
