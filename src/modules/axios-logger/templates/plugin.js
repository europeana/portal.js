import axios from 'axios';

import storeModule from './store';

const MODULE_NAME = 'axiosLogger';

export default ({ store, app, $config }, inject) => {
  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }

  const moduleConfig = $config?.[MODULE_NAME];

  const requestParams = (requestConfig) => {
    const params = {
      ...requestConfig.params
    };

    // Optionally, clear certain URL params, e.g. to obscure API keys
    for (const paramKey of (moduleConfig?.clearParams || [])) {
      params[paramKey] = (paramKey in params) ? '' : null;
    }

    return params;
  };

  const requestUri = (requestConfig, params) => {
    let uri = axios.getUri({ ...requestConfig, params: requestParams(requestConfig) });

    if (uri.startsWith('/') && requestConfig.baseURL) {
      uri = `${requestConfig.baseURL}${uri}`;
    }

    return uri;
  };

  const loggableRequest = (requestConfig) => {
    const method = requestConfig.method.toUpperCase();

    // Optionally, only log specific HTTP methods
    if (moduleConfig?.httpMethods && !moduleConfig.httpMethods.includes(method)) {
      return null;
    }

    return { method, url: requestUri(requestConfig) };
  };

  const requestInterceptor = (requestConfig) => {
    const requestLog = loggableRequest(requestConfig);

    if (requestLog) {
      store.commit(`${MODULE_NAME}/push`, requestLog);
    }

    return requestConfig;
  };

  // TODO: do these route guards get duplicated being in this default export?
  if (app?.router) {
    app.router.beforeEach((to, from, next) => {
      if (!store.state[MODULE_NAME].recording && (to.path !== from.path)) {
        store.commit(`${MODULE_NAME}/reset`);
        store.commit(`${MODULE_NAME}/start`);
      }

      next();
    });

    app.router.afterEach(() => {
      // Only stop recording client side to prevent SSR then CSR `afterEach` calls
      // for the same routing resetting the logger before the CSR.
      if (process.client) {
        store.commit(`${MODULE_NAME}/stop`);
      }
    });
  }

  inject(MODULE_NAME, requestInterceptor);
};
