// TODO: refactor to not be a plugin, to reduce the weight of pages not using
//       it, e.g. the homepage?

import EuropeanaApiEnvConfig from '@europeana/apis/src/config/env.js';

import * as APIS from '@europeana/apis';

const MODULE_NAME = 'apis';

export const API_IDS = Object.keys(APIS);

const runtimeConfig = {};

export const resetRuntimeConfig = ({ scope = 'public' }) => {
  delete runtimeConfig[scope];
};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  if (!runtimeConfig[scope]) {
    runtimeConfig[scope] = API_IDS.reduce((memo, id) => {
      memo[id] = new EuropeanaApiEnvConfig(id, scope);
      return memo;
    }, {});
  }
  return runtimeConfig[scope];
};

export const storeModule = {
  namespaced: true,

  state: () => ({
    reqHeaderUrls: {}
  }),

  mutations: {
    init(state, { $apis, req }) {
      for (const id in APIS) {
        state.reqHeaderUrls[id] = $apis?.[id]?.config?.apiUrlFromRequestHeaders?.(req?.headers);
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = API_IDS.reduce((memo, id) => {
    memo[id] = new APIS[id](context);
    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
