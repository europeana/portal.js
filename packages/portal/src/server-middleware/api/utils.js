import defu  from 'defu';
import createHttpError from 'http-errors';

import nuxtConfig from '../../../nuxt.config.js';

export const errorHandler = (err, req, res) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message;

  if (err.response) {
    status = err.response.status;
    if (err.response.data.errorMessage) {
      message = err.response.data.errorMessage;
    }
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
