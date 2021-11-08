import axios from 'axios';
import redis from 'redis';
import _pick from 'lodash/pick.js';
import { promisify } from 'util';
import { langMapValueForLocale } from '../plugins/europeana/utils.js';

const redisConfig = (config = {}) => {
  const redisOptions = {
    url: config.url
  };

  if (config.tlsCa) {
    redisOptions.tls = {
      ca: [Buffer.from(config.tlsCa, 'base64')]
    };
  }

  return redisOptions;
};

const createRedisClient = (config = {}) => {
  const redisClient = redis.createClient(redisConfig(config));

  redisClient.on('error', console.error);

  for (const fn of ['get', 'set', 'quit']) {
    redisClient[`${fn}Async`] = promisify(redisClient[fn]).bind(redisClient);
  }

  return redisClient;
};

const createEuropeanaApiClient = (config = {}) => {
  return axios.create({
    baseURL: config.url,
    params: {
      wskey: config.key
    }
  });
};

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
  return mutateObjects(data, object => localiseOne(object, fields, locale));
};

const pick = (data, fields) => {
  return mutateObjects(data, object => _pick(object, fields));
};

const mutateObjects = (data, mutator) => {
  if (Array.isArray(data)) {
    return data.map(mutator);
  } else if (typeof data === 'object') {
    return mutator(data);
  } else {
    return data;
  }
};

export {
  createEuropeanaApiClient,
  createRedisClient,
  errorMessage,
  daily,
  localise,
  pick
};
