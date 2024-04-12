/**
 * @file Global Vue filters
 * @see {@link https://vuejs.org/v2/guide/filters.html}
 */

// NOTE: use sparingly and avoid importing third-party libraries as these filters
//       are registered globally. Consider the use of locally imported mixins instead.

import Vue from 'vue';

export const wordLength = text => text?.trim()?.match(/\w+/g)?.length || 0;
Vue.filter('wordLength', wordLength);

/**
 * Convert new lines to <br/>
 * @param {string} val text value
 * @return {String} text value with HTML breaks
 */
Vue.filter('convertNewLine', (val) => {
  return val.replace(/\n/g, '<br/>');
});

Vue.filter('urlWithProtocol', (url) => url.startsWith('//') ? `https:${url}` : url);
