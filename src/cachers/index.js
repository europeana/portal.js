import defu from 'defu';
import * as utils from './utils.js';
import nuxtConfig from '../../nuxt.config.js';
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const cacherNames = [
  'collections:organisations',
  'collections:times',
  'collections:topics',
  'items:recent',
  'items:type-counts'
];

const cli = (cacherName) => {
  if (!cacherNames.includes(cacherName)) {
    throw new Error(`Unknown cacher "${cacherName}"`);
  }

  const cacherPath = cacherName.replace(/:/g, '/');

  return import(`./${cacherPath}.js`);
};

const main = async() => {
  const cacherName = process.argv[2];
  const command = process.argv[3];

  const cacher = await cli(cacherName);
  let response;

  try {
    if (command === 'set') {
      const data = await cacher.data(runtimeConfig);
      response = await writeCacheKey(cacher.CACHE_KEY, data);
    } else if (command === 'get') {
      response = await readCacheKey(cacher.CACHE_KEY);
    } else {
      console.error(`Unknown command "${command}"`);
      process.exit(1);
    }
  } catch (error) {
    return Promise.reject({ body: utils.errorMessage(error) });
  }

  return Promise.resolve(response);
};

const writeCacheKey = (cacheKey, data) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  return redisClient.setAsync(cacheKey, JSON.stringify(data))
    .then(() => redisClient.quitAsync())
    .then(() => ({ body: `Wrote data to Redis "${cacheKey}".` }));
};

const readCacheKey = (cacheKey) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  return redisClient.getAsync(cacheKey)
    .then(data => redisClient.quitAsync()
      .then(() => ({ body: JSON.parse(data) || {} })));
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
