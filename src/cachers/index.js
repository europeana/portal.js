import defu from 'defu';
import * as utils from './utils.js';
import nuxtConfig from '../../nuxt.config.js';
import localeCodes from '../plugins/i18n/codes.js';

const CACHE_KEY_PREFIX = '@europeana:portal.js';
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const cacherNames = [
  'collections:organisations',
  'collections:organisations:featured',
  'collections:places',
  'collections:places:featured',
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

const namespaceCacheKey = (cacherName, locale) => {
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
  let rawData = await cacher.data(runtimeConfig);
  let langAwareData;

  if (cacher.LOCALISE) {
    langAwareData = localeCodes.map((locale) => ({
      key: namespaceCacheKey(cacherName, locale),
      data: utils.localise(rawData, cacher.LOCALISE, locale)
    }));
  } else if (cacher.INTERNATIONALISE) {
    langAwareData = [{ key: namespaceCacheKey(cacherName), data: cacher.INTERNATIONALISE(rawData) }];
  } else {
    langAwareData = [{ key: namespaceCacheKey(cacherName), data: rawData }];
  }

  for (const toCache of langAwareData) {
    if (cacher.PICK) {
      toCache.data = utils.pick(toCache.data, cacher.PICK);
    }
    if (cacher.SORT) {
      toCache.data = utils.sort(toCache.data, cacher.SORT);
    }
    if (cacher.DAILY) {
      toCache.data = utils.daily(toCache.data, cacher.DAILY);
    }
    await writeCacheKey(toCache.key, toCache.data);
  }
};

const main = async() => {
  const command = process.argv[2];
  const cacherName = process.argv[3];

  let response;

  try {
    if (command === 'set') {
      if (cacherName === undefined) {
        for (const cname of cacherNames) {
          await runSetCacher(cname);
        }
      } else {
        await runSetCacher(cacherName);
      }

      response = 'SUCCESS';
    } else if (command === 'get') {
      response = await readCacheKey(namespaceCacheKey(cacherName));
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
