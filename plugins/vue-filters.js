/**
 * @file Global Vue filters
 * @see {@link https://vuejs.org/v2/guide/filters.html}
 */

import Vue from 'vue';

Vue.filter('localise', val => {
  if (typeof val === 'undefined' || val === null) {
    return val;
  }
  return val.toLocaleString('en');
});

Vue.filter('truncate', (val, char, ellipsis) => {
  return val.length > char ? val.substring(0, char) + ellipsis : val;
});

Vue.filter('optimisedImageUrl', (imageUrl) => {
  const hostnameMatch = imageUrl.match(/\/\/([^/]+)\//);
  if (hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net')) {
    return imageUrl + '?fm=jpg&fl=progressive&q=25';
  }
  return imageUrl;
});
