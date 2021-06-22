const utils = require('./utils');

const main = (params = {}) => {
  try {
    const redisClient = utils.createRedisClient(params);
    return redisClient.getAsync(utils.CACHE_KEY)
      .then(organisations => redisClient.quitAsync()
        .then(() => ({ body: JSON.parse(organisations) || {} })));
  } catch (error) {
    return new Promise((resolve, reject) => reject({ statusCode: 500, body: utils.errorMessage(error) }));
  }
};

const cli = () => {
  const params = {
    redisUrl: process.env.REDIS_URL,
    redisTlsCa: process.env.REDIS_TLS_CA
  };

  return main(params);
};

main.cli = cli;
module.exports = main;
