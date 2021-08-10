if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const defu = require('defu');
const utils = require('./utils');
const nuxtConfig = require('../../nuxt.config');
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const cachers = [
  'entities:organisations',
  'entities:times',
  'entities:topics',
  'items:recent'
];

const cli = (cacher) => {
  if (!cachers.includes(cacher)) {
    throw new Error(`Unknown cacher "${cacher}"`);
  }

  const cacherPath = cacher.replace(/:/g, '/');

  return require(`./${cacherPath}`);
};

const main = () => {
  const cacher = process.argv[2];
  const command = process.argv[3];

  let executor;

  const cacherCli = cli(cacher);

  switch (command) {
    case 'set':
      executor = cacherCli.cache(runtimeConfig);
      break;
    case 'get':
      executor = readCacheKey(cacherCli.CACHE_KEY);
      break;
    default:
      console.error(`Unknown command "${command}"`);
      process.exit(1);
      break;
  }

  return executor;
};

const readCacheKey = (cacheKey) => {
  try {
    const redisClient = utils.createRedisClient(runtimeConfig.redis);
    return redisClient.getAsync(cacheKey)
      .then(data => redisClient.quitAsync()
        .then(() => ({ body: JSON.parse(data) || {} })));
  } catch (error) {
    return Promise.reject({ statusCode: 500, body: utils.errorMessage(error) });
  }
};

main()
  .then(message => {
    console.log(`SUCCESS: ${JSON.stringify(message)}`);
    process.exit(0);
  })
  .catch(message => {
    console.log(`ERROR: ${message}`);
    process.exit(1);
  });
