import defu from 'defu';
import * as utils from './utils.js';
import nuxtConfig from '../../nuxt.config.js';
import localeCodes from '../plugins/i18n/codes.js';

const CACHE_KEY_PREFIX = '@europeana:portal.js';
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const cacherNames = [
  'collections:organisations',
  'collections:times',
  'collections:times:featured',
  'collections:topics',
  'collections:topics:featured',
  'items:recent',
  'items:type-counts'
];

const cacherModule = (cacherName) => {
  if (!cacherNames.includes(cacherName)) {
    throw new Error(`Unknown cacher "${cacherName}"`);
  }

  const cacherPath = cacherName.replace(/:/g, '/');

  return import(`./${cacherPath}.js`);
};

const cacheKey = (cacherName, locale) => {
  let key = CACHE_KEY_PREFIX;

  if (locale) {
    key = `${key}:${locale}`;
  }
  key = `${key}:${cacherName}`;

  return key;
};

const runSetCacher = async(cacherName) => {
  console.log(cacherName);

  const cacher = await cacherModule(cacherName);
  let data = await cacher.data(runtimeConfig);

  if (cacher.DAILY) {
    data = utils.daily(data, cacher.DAILY);
  }

  if (cacher.PICK) {
    data = utils.pick(data, cacher.PICK);
  }

  if (cacher.LOCALISE) {
    for (const locale of localeCodes) {
      const localised = utils.localise(data, cacher.LOCALISE, locale);
      await writeCacheKey(cacheKey(cacherName, locale), localised);
    }
  } else {
    await writeCacheKey(cacheKey(cacherName), data);
  }
};

const main = async() => {
  const command = process.argv[2];
  const cacherName = process.argv[3];

  let response;

  try {
    if (command === 'set') {
      if (cacherName === undefined) {
        for (const cacherName of cacherNames) {
          await runSetCacher(cacherName);
        }
      } else {
        await runSetCacher(cacherName);
      }

      response = 'SUCCESS';
    } else if (command === 'get') {
      response = await readCacheKey(cacheKey(cacherName));
    } else {
      console.error(`Unknown command "${command}"`);
      process.exit(1);
    }
  } catch (error) {
    return Promise.reject(utils.errorMessage(error));
  }

  return Promise.resolve(response);
};

const writeCacheKey = (cacheKey, data) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  return redisClient.setAsync(cacheKey, JSON.stringify(data))
    .then(() => redisClient.quitAsync());
};

const readCacheKey = (cacheKey) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  return redisClient.getAsync(cacheKey)
    .then(data => redisClient.quitAsync()
      .then(() => data));
};

main()
  .then(message => {
    console.log(message);
    process.exit(0);
  })
  .catch(message => {
    console.log(`ERROR: ${message}`);
    process.exit(1);
  });
