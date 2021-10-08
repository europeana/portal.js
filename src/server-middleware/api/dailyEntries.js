import { CACHE_KEY as TIMES_CACHE_KEY } from '../../cachers/entities/times.js';
import { CACHE_KEY as TOPICS_CACHE_KEY } from '../../cachers/entities/topics.js';
import { CACHE_KEY as ITEMS_CACHE_KEY } from '../../cachers/items/recent.js';
import { CACHE_KEY as ITEM_COUNTS_BY_MEDIA_TYPE_CACHE_KEY } from '../../cachers/items/type-counts.js';
import { createRedisClient } from '../../cachers/utils.js';
import { errorHandler } from './index.js';

const defaultSubsetSize = 4;
const completeSets = [
  ITEMS_CACHE_KEY, ITEM_COUNTS_BY_MEDIA_TYPE_CACHE_KEY
];

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * defaultSubsetSize) % setSize;
  return (offset + defaultSubsetSize <= setSize) ? offset : (setSize - defaultSubsetSize);
};

export const entriesOfTheDay = (type, config = {}) => {
  const redisClient = createRedisClient(config.redis);

  let key;
  if (type === 'time') {
    key = TIMES_CACHE_KEY;
  } else if (type === 'topic') {
    key = TOPICS_CACHE_KEY;
  } else if (type === 'item') {
    key = ITEMS_CACHE_KEY;
  } else if (type === 'itemCountsMediaType') {
    key = ITEM_COUNTS_BY_MEDIA_TYPE_CACHE_KEY;
  }

  return redisClient.getAsync(key)
    .then(value => JSON.parse(value))
    .then(parsed => {
      redisClient.quitAsync();
      const subsetSize = completeSets.includes(key) ? parsed.length : defaultSubsetSize;
      const offset = completeSets.includes(key) ? 0 : offsetOfTheDay(parsed.length);
      return parsed.slice(offset, offset + subsetSize);
    });
};

export default (type, config = {}) => (req, res) => {
  if (!config.redis.url) {
    return errorHandler(res, new Error('No cache configured.'));
  }

  return entriesOfTheDay(type, config)
    .then(times => res.json(times))
    .catch(error => errorHandler(res, error));
};
