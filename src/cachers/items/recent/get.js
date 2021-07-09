// TODO: this is identical to entities/organisations/get cacher. Refactor.

const { CACHE_KEY } = require('./utils');
const { createRedisClient, errorMessage } = require('../../utils');

const main = (config = {}) => {
  try {
    const redisClient = createRedisClient(config);
    return redisClient.getAsync(CACHE_KEY)
      .then(data => redisClient.quitAsync()
        .then(() => ({ body: JSON.parse(data) || {} })));
  } catch (error) {
    return Promise.reject({ statusCode: 500, body: errorMessage(error) });
  }
};

module.exports = main;
