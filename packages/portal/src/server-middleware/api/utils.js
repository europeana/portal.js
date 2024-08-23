import apm from 'elastic-apm-node';
import defu  from 'defu';
import createHttpError from 'http-errors';

import nuxtConfig from '../../../nuxt.config.js';

export const errorHandler = (err, req, res, next) => {
  if (err) {
    console.error(process.NODE_ENV === 'production' ? err.message : err.stack);

    const errorStatus = err.response?.status || err.status || err.statusCode || 500;
    const message = err.response?.data?.error || err.response?.data?.errorMessage || err.message;

    if (apm.isStarted()) {
      apm.captureError(err, { message, request: req, response: res });
    }

    res.status(errorStatus).send(message);
  } else {
    next();
  }
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
