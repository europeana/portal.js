import defu from 'defu';
import * as utils from './utils.js';
import nuxtConfig from '../../nuxt.config.js';
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const cachers = [
  'collections:organisations',
  'collections:times',
  'collections:topics',
  'featured:topics',
  'items:recent',
  'items:type-counts'
];

const cli = (cacher) => {
  if (!cachers.includes(cacher)) {
    throw new Error(`Unknown cacher "${cacher}"`);
  }

  const cacherPath = cacher.replace(/:/g, '/');

  return import(`./${cacherPath}.js`);
};

const main = async() => {
  const cacher = process.argv[2];
  const command = process.argv[3];

  const cacherCli = await cli(cacher);

  try {
    if (command === 'set') {
      const data = await cacherCli.data(runtimeConfig);
      const response = await writeCacheKey(cacherCli.CACHE_KEY, data);
      return response;
    } else if (command === 'get') {
      const response = await readCacheKey(cacherCli.CACHE_KEY);
      return response;
    } else {
      console.error(`Unknown command "${command}"`);
      process.exit(1);
    }
  } catch (error) {
    return Promise.reject({ body: utils.errorMessage(error) });
  }
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
