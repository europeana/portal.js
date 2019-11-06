/**
 * @file Global Vue filters
 * @see {@link https://vuejs.org/v2/guide/filters.html}
 */

import Vue from 'vue';
// TODO: remove this when the issue noted in the url plugin is resolved upstream
import { URL } from './url';

Vue.filter('localise', val => {
  if (typeof val === 'undefined' || val === null) {
    return val;
  }
  return val.toLocaleString('en');
});

Vue.filter('truncate', (val, char, ellipsis) => {
  if (!val) return null;
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
 * Convert new lines to <br/>
 * @param {string} val text value
 * @return {String} text value with HTML breaks
 */

Vue.filter('convertNewLine', (val) => {
  return val.replace(/\n/g, '<br/>');
});

Vue.filter('proxyMedia', (mediaUrl, europeanaId) => {
  const proxyUrl = new URL('https://proxy.europeana.eu');
  proxyUrl.pathname = europeanaId;
  proxyUrl.searchParams.append('url', mediaUrl);
  return proxyUrl.toString();
});
