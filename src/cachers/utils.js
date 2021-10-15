import axios from 'axios';
import redis from 'redis';
import { promisify } from 'util';

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

export {
  createEuropeanaApiClient,
  createRedisClient,
  errorMessage
};
