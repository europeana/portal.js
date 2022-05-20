import axios from 'axios';

import storeModule from './store';

const STORE_MODULE_NAME = 'axiosLogger';

export default ({ store, app, $config }, inject) => {
  if (store) {
    store.registerModule(STORE_MODULE_NAME, storeModule);
  }

  const requestInterceptor = config => {
    const method = config.method.toUpperCase();

    // Optionally, only log specific HTTP methods
    if ($config?.axiosLogger?.httpMethods && !$config.axiosLogger.httpMethods.includes(method)) {
      return config;
    }

    const params = {
      ...config.params
    };
    // Optionally, clear certain URL params, e.g. to obscure API keys
    for (const paramKey of ($config?.axiosLogger?.clearParams || [])) {
      params[paramKey] = (paramKey in params) ? '' : null;
    }

    let uri = axios.getUri({ ...config, params });
    if (uri.startsWith('/') && config.baseURL) {
      uri = `${config.baseURL}${uri}`;
    }

    store.commit(`${STORE_MODULE_NAME}/push`, { method, url: uri });

    return config;
  };

  // TODO: do these route guards get duplicated being in this default export?
  app.router.beforeEach((to, from, next) => {
    if (!store.state[STORE_MODULE_NAME].recording && (to.path !== from.path)) {
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
