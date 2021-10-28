import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

export const cached = (id, config = {}) => {
  if (!config.redis.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  const redisClient = createRedisClient(config.redis);

  const key = cacheKey(id);

  return redisClient.getAsync(key)
    .then(value => JSON.parse(value))
    .then(body => {
      redisClient.quitAsync();
      return body;
    });
};

export default (id, config = {}) => (req, res) => {
  return cached(id, config)
    // TODO: avoid parsing JSON above, then re-serializing as JSON here
    .then(data => res.json(data))
    .catch(error => errorHandler(res, error));
};
