const CACHE_KEY = '@europeana:portal.js:collections:times';
const ENTITY_TYPE = 'timespan';

import baseData from './index.js';

const data = (config = {}) => baseData({ type: ENTITY_TYPE }, config);

export {
  data,
  CACHE_KEY,
  ENTITY_TYPE
};
