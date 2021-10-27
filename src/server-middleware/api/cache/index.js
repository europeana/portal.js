import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';
import dailyEntries from './daily.js';
import pick from './pick.js';
import localise from './localise.js';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

export const cached = (id, config = {}, options = {}) => {
  if (!config.redis.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  const redisClient = createRedisClient(config.redis);

  const key = cacheKey(id);

  return redisClient.getAsync(key)
    .then(value => JSON.parse(value))
    .then(body => options.pick ? pick(body, options.pick.split(',')) : body)
    .then(body => options.locale ? localise(body, options.locale) : body)
    .then(body => options.daily ? dailyEntries(body) : body)
    .then(body => {
      redisClient.quitAsync();
      return body;
    });
};

export default (id, config = {}) => (req, res) => {
  return cached(id, config, req.query)
    .then(cachedEntries => res.json(cachedEntries))
    .catch(error => errorHandler(res, error));
};
