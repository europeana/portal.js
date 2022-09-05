/**
 * @file Global Vue filters
 * @see {@link https://vuejs.org/v2/guide/filters.html}
 */

// NOTE: use sparingly and avoid importing third-party libraries as these filters
//       are registered globally. Consider the use of locally imported mixins instead.

import Vue from 'vue';

Vue.filter('localise', val => {
  if (typeof val === 'undefined' || val === null) {
    return val;
  }
  return val.toLocaleString('en');
});

export const truncate = (text, length, ellipsis = '…') => {
  if (!text) {
    return null;
  }
  return text.length > length ? text.substring(0, length) + ellipsis : text;
};
Vue.filter('truncate', truncate);

export const wordLength = text => text?.trim()?.match(/\w+/g)?.length || 0;
Vue.filter('wordLength', wordLength);

// TODO: deprecated; superceded by OptimisedImage.vue; remove when all dependent components updated
Vue.filter('optimisedImageUrl', (imageUrl, contentType, options = {}) => {
  if (typeof contentType !== 'string') {
    return imageUrl;
  }

  const imageQueryParams = [];

  const hostnameMatch = imageUrl.match(/\/\/([^/]+)\//);
  if (hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net')) {
    // TODO: are optimisations possible on any other content types?
    if (contentType === 'image/jpeg') {
      imageQueryParams.push('fm=jpg&fl=progressive');
      imageQueryParams.push(`q=${options.quality || 50}`);
    }

    if (options.width) {
      imageQueryParams.push(`w=${options.width}`);
    }
    if (options.height) {
      imageQueryParams.push(`h=${options.height}`);
    }
  }

  if (imageQueryParams.length > 0) {
    imageUrl += '?' + imageQueryParams.join('&');
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

Vue.filter('urlWithProtocol', (url) => url.startsWith('//') ? `https:${url}` : url);
