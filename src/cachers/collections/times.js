const CACHE_KEY = '@europeana:portal.js:collections:times';
const ENTITY_TYPE = 'timespan';

import baseCache from './index.js';

const cache = (config = {}) => baseCache(CACHE_KEY, ENTITY_TYPE, config);

export {
  cache,
  CACHE_KEY,
  ENTITY_TYPE
};
