const {Given, Then, When, Before} = require('@cucumber/cucumber');

Given(/^I have a Europeana branded page title$/, function() {
  browser.assert.titleMatches(new RegExp('\\| Europeana$'));
});
