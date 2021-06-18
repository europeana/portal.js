const redis = require('redis');
const { promisify } = require('util');

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

const redisConfig = (params = {}) => {
  const redisOptions = {};

  redisOptions.url = params.redisUrl;

  if (params.redisTlsCa) {
    redisOptions.tls = {
      ca: [Buffer.from(params.redisTlsCa, 'base64')]
    };
  }

  return redisOptions;
};

let redisClient;

const main = async(params = {}) => {
  try {
    redisClient = redis.createClient(redisConfig(params));

    const redisGetAsync = promisify(redisClient.get).bind(redisClient);

    const key = '/@europeana/portal.js/entity/organizations';
    return redisGetAsync(key)
      .then(organisations => ({
        statusCode: 200, body: JSON.parse(organisations) || {}
      }));
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

module.exports = {
  cli,
  main
};
