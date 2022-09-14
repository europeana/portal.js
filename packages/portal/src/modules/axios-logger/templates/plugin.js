import axios from 'axios';

import storeModule from './store';

const MODULE_NAME = 'axiosLogger';

const requestParams = (requestConfig, moduleConfig) => {
  const params = {
    ...requestConfig.params
  };

  // Optionally, clear certain URL params, e.g. to obscure API keys
  for (const paramKey of (moduleConfig?.clearParams || [])) {
    if (paramKey in params) {
      params[paramKey] = '';
    }
  }

  return params;
};

const requestUri = (requestConfig, moduleConfig) => {
  let uri = axios.getUri({ ...requestConfig, params: requestParams(requestConfig, moduleConfig) });

  if (uri.startsWith('/') && requestConfig.baseURL) {
    uri = `${requestConfig.baseURL}${uri}`;
  }

  return uri;
};

const loggableRequest = (requestConfig, moduleConfig) => {
  const method = requestConfig.method.toUpperCase();

  // Optionally, only log specific HTTP methods
  if (moduleConfig?.httpMethods && !moduleConfig.httpMethods.includes(method)) {
    return null;
  }

  return { method, url: requestUri(requestConfig, moduleConfig) };
};

const requestInterceptor = (moduleConfig, store) => (requestConfig) => {
  const requestLog = loggableRequest(requestConfig, moduleConfig);

  if (requestLog) {
    store.commit(`${MODULE_NAME}/push`, requestLog);
  }

  return requestConfig;
};

const addRouterNavigationGuards = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (!store.state[MODULE_NAME].recording && (to.path !== from.path)) {
      store.commit(`${MODULE_NAME}/reset`);
      store.commit(`${MODULE_NAME}/start`);
    }

    next();
  });

  router.afterEach(() => {
    // Only stop recording client side to prevent SSR then CSR `afterEach` calls
    // for the same routing resetting the logger before the CSR.
    if (process.client) {
      store.commit(`${MODULE_NAME}/stop`);
    }
  });
};

export default ({ store, app, $config }, inject) => {
  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }

  // TODO: do these route guards get duplicated being in this default export?
  if (app?.router) {
    addRouterNavigationGuards(app.router, store);
  }

  const moduleConfig = $config?.[MODULE_NAME];
  inject(MODULE_NAME, requestInterceptor(moduleConfig, store));
};
