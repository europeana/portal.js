import { createClient } from 'redis';
import _pick from 'lodash/pick.js';

import { daily } from '@europeana/utils';
import { langMapValueForLocale } from '@europeana/i18n';

const createRedisClient = (config = {}) => {
  const redisClient = createClient(config);

  redisClient.on('error', console.error);

  return redisClient;
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

const localise = (data, fields, locale) => {
  return mutateObjects(data, object => localiseOne(object, fields, locale));
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
  createRedisClient,
  errorMessage,
  daily,
  localise,
  pick,
  sort
};
