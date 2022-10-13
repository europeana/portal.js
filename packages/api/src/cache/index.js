import redis from 'redis';
import errorHandler from '@europeana/express/src/error.js';
import { promisify } from 'util';

const cacheKey = (id) => `@europeana:portal.js:${id.replace(/\//g, ':')}`;

const redisConfig = (config = {}) => {
  const redisOptions = {
    url: config.url
  };

  if (config.tlsCa) {
    redisOptions.tls = {
      ca: [Buffer.from(config.tlsCa, 'base64')]
    };
  }

  return redisOptions;
};

const createRedisClient = (config = {}) => {
  const redisClient = redis.createClient(redisConfig(config));

  redisClient.on('error', console.error);

  for (const fn of ['get', 'set', 'quit']) {
    redisClient[`${fn}Async`] = promisify(redisClient[fn]).bind(redisClient);
  }

  return redisClient;
};

export const cached = (id, config = {}, options = {}) => {
  const defaults = { parse: true };
  const settings = { ...defaults, ...options };

  if (!config.url) {
    return Promise.reject(new Error('No cache configured.'));
  }
  // TODO: reuse client if already instantiated?
  const redisClient = createRedisClient(config);

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
