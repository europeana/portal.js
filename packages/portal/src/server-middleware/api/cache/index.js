import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

export const cached = async(ids, config = {}) => {
  if (!config.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  const redisClient = createRedisClient(config);

  const values = {};
  for (const id of [].concat(ids)) {
    const key = cacheKey(id);
    const value = await redisClient.getAsync(key);
    values[id] = JSON.parse(value);
  }

  redisClient.quitAsync();

  return values;
};

export default (config = {}) => (req, res) => {
  const ids = req.params[0] ? req.params[0] : req.query.id;

  return cached(ids, config)
    .then(data => {
      res.set('Content-Type', 'application/json');
      res.send(data);
    })
    .catch(error => errorHandler(res, error));
};
