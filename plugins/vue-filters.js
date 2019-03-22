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

Vue.filter('searchFacetHeader', val => {
  const headerText = {
    'REUSABILITY': 'Can I reuse this?',
    'TYPE': 'Type of media'
  };
  return headerText[val] || val;
});
