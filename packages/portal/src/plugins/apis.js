import decamelize from 'decamelize';

import * as annotation from './europeana/annotation.js';
import * as entity from './europeana/entity.js';
import * as entityManagement from './europeana/entity-management.js';
import * as fulltext from './europeana/fulltext.js';
import * as iiif from './europeana/iiif.js';
import * as proxy from './europeana/proxy.js';
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
  iiif,
  proxy,
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

const nuxtRuntimeConfigs = {};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  if (!nuxtRuntimeConfigs[scope]) {
    const envKeySuffix = scope === 'public' ? '' : `_${scope.toUpperCase()}`;

    nuxtRuntimeConfigs[scope] = Object.keys(apis).reduce((memo, api) => {
      const apiConfig = {};

      const envKeyPrefix = `EUROPEANA_${decamelize(api).toUpperCase()}_API_`;

      apiConfig.url = process.env[`${envKeyPrefix}URL${envKeySuffix}`] || apis[api].BASE_URL;

      if (apis[api].AUTHENTICATING) {
        if (process.env[`${envKeyPrefix}KEY${envKeySuffix}`]) {
          apiConfig.key = process.env[`${envKeyPrefix}KEY${envKeySuffix}`];
        } else if (process.env[`EUROPEANA_API_KEY${envKeySuffix}`]) {
          apiConfig.key = process.env[`EUROPEANA_API_KEY${envKeySuffix}`];
        }
      }

      memo[api] = apiConfig;

      return memo;
    }, {});
  }

  return nuxtRuntimeConfigs[scope];
};

export const publicPrivateRewriteOrigins = () => {
  const publicNuxtRuntimeConfig = nuxtRuntimeConfig({ scope: 'public' });
  const privateNuxtRuntimeConfig = nuxtRuntimeConfig({ scope: 'private' });

  return Object.keys(privateNuxtRuntimeConfig).reduce((memo, api) => {
    if (privateNuxtRuntimeConfig[api].url) {
      memo.push({
        from: privateNuxtRuntimeConfig[api].url,
        to: publicNuxtRuntimeConfig[api].url
      });
    }

    return memo;
  }, []);
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = {
    annotation: annotation.default(context),
    entity: entity.default(context),
    entityManagement: entityManagement.default(context),
    recommendation: recommendation.default(context),
    record: record.default(context),
    set: set.default(context),
    thumbnail: thumbnail.default(context)
  };

  inject(MODULE_NAME, plugin);
};
