import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

export const cached = (id, config = {}, options = {}) => {
  const defaults = { parse: true };
  const settings = { ...defaults, ...options };

  if (!config.redis.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  const redisClient = createRedisClient(config.redis);

  const key = cacheKey(id);

  return redisClient.getAsync(key)
    .then(value => settings.parse ? JSON.parse(value) : value)
    .then(body => {
      redisClient.quitAsync();
      return body;
    });
};

export default (id, config = {}) => (req, res) => {
  return cached(id, config, { parse: false })
    .then(data => {
      res.set('Content-Type', 'application/json');
      res.send(data);
    })
    .catch(error => errorHandler(res, error));
};
