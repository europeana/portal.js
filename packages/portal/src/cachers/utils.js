import axios from 'axios';
import redis from 'redis';
import _pick from 'lodash/pick.js';
import { promisify } from 'util';
import { daily, langMapValueForLocale } from '../plugins/europeana/utils.js';

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

const localiseOne = (item, fields, locale) => {
  const localised = { ...item };

  for (const field of [].concat(fields)) {
    if (localised[field]) {
      localised[field] = langMapValueForLocale(localised[field], locale).values[0];
    }
  }

  return localised;
};

const localiseOneContentful = (item, fields, locale) => {
  const localised = { ...item };

  for (const field of [].concat(fields)) {
    if (localised[field]) {
      const localisedKey = `${field}_${locale}`;
      localised[field] = localised[localisedKey];
    }
  }

  return localised;
};

const localise = (data, fields, locale) => {
  return mutateObjects(data, object => localiseOne(object, fields, locale));
};

const localiseContentful = (data, fields, locale) => {
  return mutateObjects(data, object => localiseOneContentful(object, fields, locale));
};

const pick = (data, fields) => {
  return mutateObjects(data, object => _pick(object, fields));
};

const sort = (data, sortOn) => {
  const sortFn = typeof sortOn === 'function' ? sortOn : (value) => value[sortOn];
  return data.sort((a, b) =>
    sortFn(a).localeCompare(sortFn(b), undefined, {
      numeric: true,
      sensitivity: 'base'
    }));
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
  localiseContentful,
  pick,
  sort
};
