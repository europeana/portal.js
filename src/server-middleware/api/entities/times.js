const { CACHE_KEY } = require('../../../cachers/entities/times');
const { createRedisClient } = require('../../../cachers/utils');
import { errorHandler } from '../';

const subsetSize = 4;

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return offset + subsetSize <= setSize ? offset : setSize - subsetSize;
};

export const timesOfTheDay = (config = {}) => {
  const redisClient = createRedisClient(config.redis);

  return redisClient.getAsync(CACHE_KEY)
    .then(value => JSON.parse(value))
    .then(parsed => {
      const offset = offsetOfTheDay(parsed.length);
      return parsed.slice(offset, offset + subsetSize);
    });
};

export default (config = {}) => (req, res) => {
  if (!config.redis.url) {
    return errorHandler(res, new Error('No cache configured.'));
  }

  return timesOfTheDay(config)
    .then(times => res.json(times))
    .catch(error => errorHandler(res, error));
};
