// Nuxt has no global.URL available by default
// @see https://github.com/nuxt/nuxt.js/issues/4914
//
// Resolved in Vue by https://github.com/vuejs/vue/pull/10414
// ... but unreleased yet.
//
// Temporary workaround pending new Vue version.
// Courtesy of https://github.com/nuxt/nuxt.js/issues/4914#issuecomment-534585817
//
// TODO: remove when fixed upstream.

import * as url from 'url';

// Create the URL contructor for node or use the existing one for the browser
const urlConstructor = (process.server) ? url.URL : URL;

// Create the URLSearchParams contructor for node or use the existing one for the browser
const paramsConstructor = (process.server) ? url.URLSearchParams : URLSearchParams;

export { urlConstructor as URL };

export { paramsConstructor as URLSearchParams };
