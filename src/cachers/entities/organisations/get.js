const { createRedisClient, errorMessage } = require('./utils');

const main = (params = {}) => {
  try {
    const redisClient = createRedisClient(params);
    const key = '/@europeana/portal.js/entity/organizations';
    return redisClient.getAsync(key)
      .then(organisations => redisClient.quitAsync()
        .then(() => ({
          statusCode: 200, body: JSON.parse(organisations) || {}
        })));
  } catch (error) {
    return new Promise((resolve, reject) => reject({ statusCode: 500, body: errorMessage(error) }));
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
