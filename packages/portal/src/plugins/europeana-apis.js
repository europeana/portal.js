// TODO: refactor to not be a plugin, to reduce the weight of pages not using
//       it, e.g. the homepage?

import EuropeanaApiEnvConfig from './europeana/apis/config/env.js';
import { APIS as PROXIED_APIS } from '../server-middleware/api/proxy/index.js';

import annotation from './europeana/annotation.js';
import auth from './europeana/auth.js';
import entity from './europeana/entity.js';
import entityManagement from './europeana/entity-management.js';
import fulltext from './europeana/fulltext.js';
import iiifPresentation from './europeana/iiif/presentation.js';
import mediaProxy from './europeana/media-proxy.js';
import recommendation from './europeana/recommendation.js';
import record from './europeana/record.js';
import set from './europeana/set.js';
import thumbnail from './europeana/thumbnail.js';

const MODULE_NAME = 'apis';

export const APIS = {
  annotation,
  auth,
  entity,
  entityManagement,
  fulltext,
  iiifPresentation,
  mediaProxy,
  recommendation,
  record,
  set,
  thumbnail
};

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
    const api = new APIS[id](context);

    if (PROXIED_APIS.includes(id)) {
      if (process.client) {
        api.axios.defaults.baseURL = api.constructor.BASE_URL.replace('https://api.europeana.eu', `${context.$config.app.baseUrl}/_api`);
        delete api.axios.defaults.headers['x-api-key'];
      }
    }

    memo[id] = api;

    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
