// Version numbers of the app itself and select dependencies, that need to be
// known in various places throughout the codebase. Intended as a temporary
// solution until importing JSON files is no longer considered experimental in
// Node.js, at which time we may instead import from the respective package.json
// files to get the versions.
//
// NOTE: This file is auto-updated by ./bin/pkg-versions.js

export default {
  '@europeana/portal': '1.62.2',
  '@nuxt/core': '2.15.8',
  'bootstrap': '4.6.1',
  'bootstrap-vue': '2.21.2'
};
