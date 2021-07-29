const { CACHE_KEY } = require('../../../cachers/items/recent');
const { createRedisClient } = require('../../../cachers/utils');
import { errorHandler } from '../';

export const recentItems = (config = {}) => {
  const redisClient = createRedisClient(config.redis);

  return redisClient.getAsync(CACHE_KEY)
    .then(value => JSON.parse(value))
    .then(body => {
      redisClient.quitAsync();
      return body;
    });
};

export default (config = {}) => (req, res) => {
  if (!config.redis.url) {
    return errorHandler(res, new Error('No cache configured.'));
  }

  return recentItems(config)
    .then(items => res.json(items))
    .catch(error => errorHandler(res, error));
};
