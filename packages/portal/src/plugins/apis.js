import decamelize from 'decamelize';

import * as annotation from './europeana/annotation.js';
import * as entity from './europeana/entity.js';
import * as entityManagement from './europeana/entity-management.js';
import * as fulltext from './europeana/fulltext.js';
import * as iiifPresentation from './europeana/iiif/presentation.js';
import * as mediaProxy from './europeana/media-proxy.js';
import * as recommendation from './europeana/recommendation.js';
import * as record from './europeana/record.js';
import * as set from './europeana/set.js';
import * as thumbnail from './europeana/thumbnail.js';

const MODULE_NAME = 'apis';

const apis = {
  annotation,
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

const apiUrlFromRequestHeaders = (api, headers) => {
  return headers[`x-europeana-${api}-api-url`];
};

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {}
  }),

  mutations: {
    init(state, { req }) {
      for (const api in apis) {
        const apiBaseURL = apiUrlFromRequestHeaders(api, req.headers);

        if (apiBaseURL && this.$apis?.[api]?.$axios) {
          this.$apis[api].$axios.defaults.baseURL = apiBaseURL;
        }
        state.urls[api] = apiBaseURL;
      }
    }
  }
};

const apiConfig = (id, scope) => {
  const envKeySuffix = scope === 'public' ? '' : `_${scope.toUpperCase()}`;

  const apiConfig = {};

  const envKeyPrefix = `EUROPEANA_${decamelize(id).toUpperCase()}_API_`;

  if (process.env[`${envKeyPrefix}URL${envKeySuffix}`]) {
    apiConfig.url = process.env[`${envKeyPrefix}URL${envKeySuffix}`];
  } else if (scope === 'public') {
    apiConfig.url = apis[id].BASE_URL;
  }

  if (apis[id].AUTHENTICATING) {
    if (process.env[`${envKeyPrefix}KEY${envKeySuffix}`]) {
      apiConfig.key = process.env[`${envKeyPrefix}KEY${envKeySuffix}`];
    } else if (process.env[`EUROPEANA_API_KEY${envKeySuffix}`]) {
      apiConfig.key = process.env[`EUROPEANA_API_KEY${envKeySuffix}`];
    }
  }

  return apiConfig;
};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  return Object.keys(apis).reduce((memo, id) => {
    memo[id] = apiConfig(id, scope);
    return memo;
  }, {});
};

export const publicPrivateRewriteOrigins = () => {
  const publicNuxtRuntimeConfig = nuxtRuntimeConfig({ scope: 'public' });
  const privateNuxtRuntimeConfig = nuxtRuntimeConfig({ scope: 'private' });

  return Object.keys(privateNuxtRuntimeConfig).reduce((memo, id) => {
    if (privateNuxtRuntimeConfig[id].url) {
      memo.push({
        from: privateNuxtRuntimeConfig[id].url,
        to: publicNuxtRuntimeConfig[id].url
      });
    }
    return memo;
  }, []);
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = Object.keys(apis).reduce((memo, id) => {
    if (apis[id].default) {
      memo[id] = apis[id].default(context);
    }
    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
