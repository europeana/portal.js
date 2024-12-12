const { Given } = require('@cucumber/cucumber');

Given(/^I open the home page$/, function() {
  return browser.page.HomePage().navigate();
});

Given(/^I open an item page with IIIF annotations$/, function() {
  return browser.page.item.ItemPageWithIIIFAnnotations().navigate();
});
