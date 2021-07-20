const redis = require('redis');
const { promisify } = require('util');

const redisConfig = (params = {}) => {
  const redisOptions = {
    url: params.redisUrl
  };

  if (params.redisTlsCa) {
    redisOptions.tls = {
      ca: [Buffer.from(params.redisTlsCa, 'base64')]
    };
  }

  return redisOptions;
};

const createRedisClient = (params = {}) => {
  const redisClient = redis.createClient(redisConfig(params));

  redisClient.on('error', console.error);

  for (const fn of ['get', 'set', 'quit']) {
    redisClient[`${fn}Async`] = promisify(redisClient[fn]).bind(redisClient);
  }

  return redisClient;
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
  createRedisClient,
  errorMessage
};
