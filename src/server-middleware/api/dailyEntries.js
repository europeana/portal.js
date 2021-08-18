const TIMES_CACHE_KEY = require('../../cachers/entities/times').CACHE_KEY;
const TOPICS_CACHE_KEY = require('../../cachers/entities/topics').CACHE_KEY;
const ITEMS_CACHE_KEY = require('../../cachers/items/recent').CACHE_KEY;
const { createRedisClient } = require('../../cachers/utils');
import { errorHandler } from './';

const subsetSize = 4;

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
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
  }

  return redisClient.getAsync(key)
    .then(value => JSON.parse(value))
    .then(parsed => {
      redisClient.quitAsync();
      const offset = offsetOfTheDay(parsed.length);
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
