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

export const forbiddenUnlessOriginAllowed = (req, res, next) => {
  const reqOrigin = req.get('origin');
  const resAccessControlAllowOrigin = res.get('access-control-allow-origin');

  // TODO: require origin to be present?
  const originAllowed = !reqOrigin ||
    (reqOrigin === nuxtRuntimeConfig('app').baseUrl) ||
    ['*', reqOrigin].includes(resAccessControlAllowOrigin);

  if (originAllowed) {
    next();
  } else {
    errorHandler(res, createHttpError(403, 'Origin not permitted'));
  }
};
