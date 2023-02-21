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

const apiUrlFromRequestHeaders = (api, headers) => {
  return headers[`x-europeana-${api}-api-url`];
};

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      entityManagement: null,
      recommendation: null,
      record: null,
      set: null,
      thumbnail: null
    }
  }),

  mutations: {
    init(state, { req }) {
      for (const api in state.urls) {
        const apiBaseURL = apiUrlFromRequestHeaders(api, req.headers);

        if (apiBaseURL && this.$apis?.[api]?.$axios) {
          this.$apis[api].$axios.defaults.baseURL = apiBaseURL;
        }
        state.urls[api] = apiBaseURL;
      }
    }
  }
};

// const europeanaApis = [
//   'annotation',
//   'entity',
//   'entityManagement',
//   'iiifPresentation',
//   'fulltext',
//   'mediaProxy',
//   'recommendation',
//   'record',
//   'thumbnail',
//   'set'
// ];

export const baseURLs = {
  annotation: annotation.BASE_URL,
  entity: entity.BASE_URL,
  entityManagement: entityManagement.BASE_URL,
  fulltext: fulltext.BASE_URL,
  iiifPresentation: iiif.PRESENTATION_URL,
  proxy: proxy.BASE_URL,
  recommendation: recommendation.BASE_URL,
  record: record.BASE_URL,
  set: set.BASE_URL,
  thumbnail: thumbnail.BASE_URL
};

const nuxtRuntimeConfigs = {};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  if (!nuxtRuntimeConfigs[scope]) {
    const envKeySuffix = scope === 'public' ? '' : `_${scope.toUpperCase()}`;

    nuxtRuntimeConfigs[scope] = Object.keys(baseURLs).reduce((memo, api) => {
      const apiConfig = {};
      if (process.env.EUROPEANA_API_KEY) {
        apiConfig.key = process.env.EUROPEANA_API_KEY;
      }

      for (const setting of ['key', 'url']) {
        let envKey = `EUROPEANA_${decamelize(api).toUpperCase()}_${setting.toUpperCase()}${envKeySuffix}`;
        if (process.env[envKey]) {
          apiConfig[setting] = process.env[envKey];
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
