const CACHE_KEY = '@europeana:portal.js:collections:organisations';
const ENTITY_TYPE = 'organization';

import baseCache from './index.js';

const cache = (config = {}) => baseCache(CACHE_KEY, ENTITY_TYPE, config);

export {
  cache,
  CACHE_KEY,
  ENTITY_TYPE
};
