import defu  from 'defu';
import createHttpError from 'http-errors';

import nuxtConfig from '../../../nuxt.config.js';

export const errorHandler = (res, error) => {
  let status = error.status || 500;
  let message = error.message;

  if (error.response) {
    status = error.response.status;
    message = error.response.data.errorMessage;
  }

  res.status(status).set('Content-Type', 'text/plain').send(message);
};

let runtimeConfig;
export const nuxtRuntimeConfig = (key) => {
  if (!runtimeConfig) {
    runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);
  }

  if (key) {
    return runtimeConfig[key];
  } else {
    return runtimeConfig;
  }
};

export const forbiddenUnlessOriginAllowed = (origins) => (origin, callback) => {
  if (origins.includes(origin)) {
    callback(null, true);
  } else {
    callback(createHttpError(403, 'Origin not permitted'));
  }
};
