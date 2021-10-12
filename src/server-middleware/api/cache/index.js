import createError from 'http-errors';
import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';

import { CACHE_KEY as ORGANISATIONS_CACHE_KEY } from '../../../cachers/collections/organisations.js';
import { CACHE_KEY as TOPICS_CACHE_KEY } from '../../../cachers/collections/topics.js';
import { CACHE_KEY as TIMES_CACHE_KEY } from '../../../cachers/collections/times.js';
import { CACHE_KEY as RECENT_CACHE_KEY } from '../../../cachers/items/recent.js';
import { CACHE_KEY as MEDIA_TYPE_COUNTS_CACHE_KEY } from '../../../cachers/items/type-counts.js';

const cacheKey = (id) => {
  return {
    'collections/organisations': ORGANISATIONS_CACHE_KEY,
    'collections/times': TIMES_CACHE_KEY,
    'collections/topics': TOPICS_CACHE_KEY,
    'items/mediaTypeCounts': MEDIA_TYPE_COUNTS_CACHE_KEY,
    'items/recent': RECENT_CACHE_KEY
  }[id];
};

export const cached = (id, config = {}) => {
  if (!config.redis.url) {
    throw createError(500, 'No cache configured.');
  }
  const redisClient = createRedisClient(config.redis);

  const key = cacheKey(id);
  if (!key) {
    throw createError(404);
  }

  return redisClient.getAsync(key)
    .then(value => JSON.parse(value))
    .then(body => {
      redisClient.quitAsync();
      return body;
    });
};

export default (id, config = {}) => (req, res) => {
  return cached(id, config)
    .then(cachedEntries => res.json(cachedEntries))
    .catch(error => errorHandler(res, error));
};
