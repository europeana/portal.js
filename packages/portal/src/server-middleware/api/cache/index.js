import { createClient } from 'redis';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

const createRedisClient = (config = {}) => {
  const redisClient = createClient(config);

  redisClient.on('error', console.error);

  return redisClient;
};

export const cached = async(ids, config = {}) => {
  if (!config.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  const redisClient = createRedisClient(config);
  await redisClient.connect();

  const values = {};
  for (const id of [].concat(ids)) {
    const key = cacheKey(id);
    const value = await redisClient.get(key);
    values[id] = JSON.parse(value);
  }

  redisClient.disconnect();

  return values;
};

export default (config = {}) => (req, res, next) => {
  const ids = req.params[0] ? req.params[0] : req.query.id;

  return cached(ids, config)
    .then((data) => {
      res.set('Content-Type', 'application/json');
      res.send(data);
    })
    .catch(next);
};
