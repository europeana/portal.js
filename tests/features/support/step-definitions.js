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

defineStep('I browse/open/visit (a/an/the)( ){target}', (pageName) =>
  i.openAPage(pageName));

defineStep('I find/identify/see/spot (a/an/the)( ){target}', (qa) =>
  i.seeATarget(qa));

defineStep('I find/identify/see/spot (a/an/the)( ){target} in/on a/an/the {target}', (qa, parentQa) =>
  i.seeATarget([qa, parentQa]));

defineStep('I find/identify/see/spot (a/an/the)( ){target} with the text {string}', (qa, text) =>
  i.seeATargetWithText(qa, text));

defineStep('I can\'t/don\'t find/identify/see/spot (a/an/the)( ){target}', (qa) =>
  i.doNotSeeATarget(qa));

defineStep('I can\'t/don\'t  find/identify/see/spot (a/an/the)( ){target} in/on the {target}', (qa, parentQa) =>
  i.doNotSeeATarget([qa, parentQa]));

defineStep('I wait/pause {int} second(s)', (seconds) =>
  i.waitSomeSeconds(seconds));

defineStep('I enter/fill/input/supply/type {string} in/on (the ){target}', (text, qa) =>
  i.enterTextInTarget(text, qa));

defineStep('I activate/click (the/a/an)( ){target}', (qa) =>
  i.clickOnTheTarget(qa));

defineStep('I activate/click (on )(the/a/an)( ){target} in/on a/an/the {target}', (qa, parentQa) =>
  i.clickOnTheTarget([qa, parentQa]));

defineStep('I check/click the {string} checkbox', (inputValue) =>
  i.checkTheCheckbox(inputValue));

defineStep('I activate/click (the/a/an)( ){string} link', (href) =>
  i.clickOnLink(href));

defineStep('I should be on (the ){target}', (pageName) =>
  i.shouldBeOn(pageName));

defineStep('I wait for (a/an/the)( ){target}', (qa) =>
  i.waitForTargetToBeVisible(qa));

defineStep('I find/identify/see/spot a link to {string} in (a/an/the)( ){target}', (linkHref, qa) =>
  i.seeALinkInTarget(linkHref, qa));

defineStep('I should have/see/see/spot {int} {target}', (count, qa) =>
  i.countTarget(count, qa));
