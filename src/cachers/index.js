import pick from 'lodash/pick.js';
import defu from 'defu';
import * as utils from './utils.js';
import nuxtConfig from '../../nuxt.config.js';
import { langMapValueForLocale } from '../plugins/europeana/utils.js';
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

const dailyOffset = (setSize, subsetSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

const daily = (set, subsetSize) => {
  if (!Array.isArray(set)) {
    return set;
  }
  const offset = dailyOffset(set.length, subsetSize);
  return set.slice(offset, offset + subsetSize);
};

const localiseOne = (item, fields, locale) => {
  const localised = { ...item };

  for (const field of [].concat(fields)) {
    if (localised[field]) {
      localised[field] = langMapValueForLocale(localised[field], locale).values[0];
    }
  }

  return localised;
};

const localise = (data, fields, locale) => {
  if (Array.isArray(data)) {
    return data.map(item => localiseOne(item, fields, locale));
  } else if (typeof data === 'object') {
    return localiseOne(data, fields, locale);
  } else {
    return data;
  }
};

const cacheKey = (cacherName, locale) => {
  let key = CACHE_KEY_PREFIX;

  if (locale) {
    key = `${key}:${locale}`;
  }
  key = `${key}:${cacherName}`;

  return key;
};

// TODO: move conditional mutations to own script files?
const runSetCacher = async(cacherName) => {
  console.log(cacherName);
  const cacher = await cacherModule(cacherName);
  let data = await cacher.data(runtimeConfig);

  if (cacher.DAILY && Array.isArray(data)) {
    data = daily(data, cacher.DAILY);
  }

  if (cacher.PICK) {
    if (Array.isArray(data)) {
      data = data.map(item => pick(item, cacher.PICK));
    } else if (typeof data === 'object') {
      data = pick(data, cacher.PICK);
    }
  }

  if (cacher.LOCALISE) {
    for (const locale of localeCodes) {
      await writeCacheKey(cacheKey(cacherName, locale), localise(data, cacher.LOCALISE, locale));
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
