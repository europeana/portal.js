/**
 * @file Global Vue filters
 * @see {@link https://vuejs.org/v2/guide/filters.html}
 */

import Vue from 'vue';

const locales = require('./i18n/locales.json');

Vue.filter('localise', val => {
  if (typeof val === 'undefined' || val === null) {
    return val;
  }
  return val.toLocaleString('en');
});

Vue.filter('truncate', (val, char, ellipsis) => {
  return val.length > char ? val.substring(0, char) + ellipsis : val;
});

Vue.filter('optimisedImageUrl', (imageUrl, contentType) => {
  if (typeof contentType !== 'string') return imageUrl;

  const hostnameMatch = imageUrl.match(/\/\/([^/]+)\//);
  if (hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net')) {
    if (contentType === 'image/jpeg') {
      return imageUrl + '?fm=jpg&fl=progressive&q=50';
    }
    // TODO: are optimisations possible on any other content types?
  }
  return imageUrl;
});

/**
 * Get the localised value
 * @param {string} val text value
 * @param {Object} locale current locale
 * @return {Object} localised value, including language if different from current UI language
 */

Vue.filter('inCurrentLanguage', (val, locale) => {
  let languageKeys = ['en', 'eng', 'def', 'und']; // predefined set of preferred/fallback languages
  const currentLocale = locales.find(l => l.code === locale);

  if (currentLocale.code !== 'en') { // if language code is not en, add both 2 and 3 character language code to preferred languages
    languageKeys.unshift(currentLocale.code);
    languageKeys.unshift(currentLocale.isoAlpha3);
  }

  for (let key of languageKeys) { // loop through all language key to find a match
    if (val[key]) {
      let htmlLang = '';
      if (key !== 'def' && key !== 'und') {
        const langCode = key.length === 3 ? locales.find(l => l.isoAlpha3 === key).code : key; // if there is a match, find language code
        htmlLang = currentLocale.code !== langCode ? langCode : ''; // output if different from UI language
      }
      return { 'code': htmlLang, 'value': val[key] }; // output both language code and value, value can be string or array
    }
  }
  return;
});

/**
 * Convert new lines to <br/>
 * @param {string} val text value
 * @return {String} text value with HTML breaks
 */

Vue.filter('convertNewLine', (val) => {
  return val.replace(/\n/g, '<br/>');
});
