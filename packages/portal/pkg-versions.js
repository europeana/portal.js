// Version numbers of the app itself and select dependencies, that need to be
// known in various places throughout the codebase. Intended as a temporary
// solution until importing JSON files is no longer considered experimental in
// Node.js, at which time we may instead import from the respective package.json
// files to get the versions.
//
// NOTE: This file is auto-updated by ./bin/pkg-versions.js

// TODO: it should also be auto-updated when running npm install/update/etc

export default {
  '@europeana/portal': '1.149.2',
  '@nuxt/core': '2.17.0',
  'bootstrap': '4.6.2',
  'bootstrap-vue': '2.22.0'
};
