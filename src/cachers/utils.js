const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

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

const writeToRedis = (redisClient, cacheKey, data) => {
  return redisClient
    .setAsync(cacheKey, JSON.stringify(data))
    .then(() => redisClient.quitAsync())
    .then(() => (`Wrote data to Redis "${cacheKey}".`));
};

const createEuropeanaApiClient = (config = {}) => {
  return axios.create({
    baseURL: config.url,
    params: {
      wskey: config.key
    }
  });
};

const errorMessage = (error) => {
  let message;

  if (error.response) {
    if (error.response.data.error) {
      message = error.response.data.error;
    } else {
      message = `${error.response.status} ${error.response.statusText}`;
    }
  } else {
    message = error.message;
  }

  return message;
};

module.exports = {
  createEuropeanaApiClient,
  createRedisClient,
  errorMessage,
  writeToRedis
};
