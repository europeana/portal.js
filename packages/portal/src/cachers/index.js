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
  'galleries:recent',
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
  let rawData = await cacher.data(runtimeConfig, localeCodes);
  let langAwareData;

  if (cacher.LOCALISE) {
    langAwareData = localeCodes.map((locale) => ({
      key: namespaceCacheKey(cacherName, locale),
      data: utils.localise(rawData[locale] || rawData, cacher.LOCALISE, locale)
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

const writeCacheKey = async(cacheKey, data) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  await redisClient.setAsync(cacheKey, JSON.stringify(data));
  await redisClient.quitAsync();
};

const runGetCacher = async(cacherName) => {
  const cacher = await cacherModule(cacherName);
  const keys = [];
  const responses = {};

  if (cacher.LOCALISE) {
    keys.push(...localeCodes.map((locale) => {
      return namespaceCacheKey(cacherName, locale);
    }));
  } else {
    keys.push(namespaceCacheKey(cacherName));
  }
  for (const key of keys) {
    responses[key] = await readCacheKey(key);
  }

  return responses;
};

const readCacheKey = async(cacheKey) => {
  const redisClient = utils.createRedisClient(runtimeConfig.redis);
  const data = await redisClient.getAsync(cacheKey);
  await redisClient.quitAsync();
  return data;
};

export const run = async(command, cacherName) => {
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
      response = await runGetCacher(cacherName);
    } else {
      throw new Error(`Unknown command "${command}"`);
    }
  } catch (error) {
    return Promise.reject(new Error(utils.errorMessage(error)));
  }

  return Promise.resolve(response);
};

export const cli = async(command, cacherName) => {
  try {
    const message = await run(command, cacherName);
    console.log(message);
    process.exit(0);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default run;
