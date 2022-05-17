import axios from 'axios';

import storeModule from './store';

const STORE_MODULE_NAME = 'axiosLogger';

export default ({ store, app }, inject) => {
  if (store) {
    store.registerModule(STORE_MODULE_NAME, storeModule);
  }

  const requestInterceptor = config => {
    let uri = axios.getUri(config);
    if (uri.startsWith('/') && config.baseURL) {
      uri = `${config.baseURL}${uri}`;
    }
    const method = config.method.toUpperCase();
    store.commit(`${STORE_MODULE_NAME}/push`, { method, url: uri });

    return config;
  };

  // TODO: do these route guards get duplicated being in this default export?
  app.router.beforeEach((to, from, next) => {
    if (!store.state[STORE_MODULE_NAME].recording) {
      store.commit(`${STORE_MODULE_NAME}/reset`);
      store.commit(`${STORE_MODULE_NAME}/start`);
    }

    next();
  });

  app.router.afterEach(() => {
    // Only stop recording client side to prevent SSR then CSR `afterEach` calls
    // for the same routing resetting the logger before the CSR.
    if (process.client) {
      store.commit(`${STORE_MODULE_NAME}/stop`);
    }
  });

  inject('axiosLogger', requestInterceptor);
};
