// Custom Vue router query parsing and stringification

// CommonJS due to needing to dynamically load qs for the router to have access
// to it, and import('qs') returning a promise which is not resolved by the router.
//
// See https://github.com/nuxt/nuxt.js/issues/2098#issuecomment-417857694

const parseQuery = (query) => require('qs').parse(query);

// To ensure that `"query": ""` results in `?query=`, not `?query`
const stringifyQuery = query => {
  const stringified = require('qs').stringify(query, { arrayFormat: 'repeat' });
  return stringified ? '?' + stringified : '';
};

module.exports = {
  parseQuery,
  stringifyQuery
};
