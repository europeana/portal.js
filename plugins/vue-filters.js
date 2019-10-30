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

Vue.filter('inCurrentLanguage', (val, locale) => {
  let languageKeys = ['en', 'eng', 'def', 'und'];
  const currentLocale = locales.find(l => l.code === locale);

  if (currentLocale.code !== 'en' || currentLocale.isoAlpha3 !== 'eng') {
    languageKeys.unshift(currentLocale.code);
    languageKeys.unshift(currentLocale.isoAlpha3);
  }

  for (let key of languageKeys) {
    if (val[key]) {
      let htmlLang = '';
      if (key !== 'def' && key !== 'und') {
        const langCode = key.length === 3 ? locales.find(l => l.isoAlpha3 === key).code : key;
        htmlLang = currentLocale.code !== langCode ? langCode : '';
      }
      return { 'code': htmlLang, 'value': val[key].join('\n\n').replace(/\n/g, '<br/>') };
    }
  }
  return;
});
