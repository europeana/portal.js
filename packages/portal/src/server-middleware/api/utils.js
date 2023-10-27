import defu  from 'defu';

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

export const nuxtRuntimeConfig = (key) => {
  const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);
  if (key) {
    return runtimeConfig[key];
  } else {
    return runtimeConfig;
  }
};
