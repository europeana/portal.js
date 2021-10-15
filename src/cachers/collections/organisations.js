const CACHE_KEY = '@europeana:portal.js:collections:organisations';
const ENTITY_TYPE = 'organization';

import baseData from './index.js';

const data = (config = {}) => baseData(ENTITY_TYPE, config);

export {
  data,
  CACHE_KEY,
  ENTITY_TYPE
};
