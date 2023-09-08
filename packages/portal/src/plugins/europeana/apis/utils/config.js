// TODO: split into multiple files, e.g. config/env.js, config/context.js,
//       config/nuxt.js

import kebabCase from 'lodash/kebabCase.js';
import snakeCase from 'lodash/snakeCase.js';

import { APIS } from '../index.js';

export class EuropeanaApiEnvConfig {
  constructor(id, scope) {
    this.id = id;
    this.scope = scope;

    this.envKeyPrefix = `EUROPEANA_${snakeCase(id).toUpperCase()}_API_`;
    this.envKeySuffix = scope === 'public' ? '' : `_${scope.toUpperCase()}`;

    this.key = this.keyFromEnv;
    this.url = this.urlFromEnv;
  }

  get keyFromEnv() {
    let keyFromEnv;

    if (APIS[this.id].AUTHENTICATING) {
      if (process.env[`${this.envKeyPrefix}KEY${this.envKeySuffix}`]) {
        // API-specific key
        keyFromEnv = process.env[`${this.envKeyPrefix}KEY${this.envKeySuffix}`];
      } else if (process.env[`EUROPEANA_API_KEY${this.envKeySuffix}`]) {
        // Shared API key
        keyFromEnv = process.env[`EUROPEANA_API_KEY${this.envKeySuffix}`];
      }
    }

    return keyFromEnv;
  }

  get urlFromEnv() {
    let urlFromEnv = APIS[this.id].BASE_URL;

    if (process.env[`${this.envKeyPrefix}URL${this.envKeySuffix}`]) {
      // Overriden API URL
      urlFromEnv = process.env[`${this.envKeyPrefix}URL${this.envKeySuffix}`];
    }

    return urlFromEnv;
  }
}

export class EuropeanaApiContextConfig {
  constructor(id, context) {
    this.id = id;
    this.key = this.keyFromContext(context);
    this.url = this.urlFromContext(context);
  }

  keyFromContext(context) {
    return context.$config.europeana.apis[this.id].key;
  }

  urlFromContext(context) {
    return this.apiUrlFromRequestHeaders(context.req?.headers) ||
      context.store.state.apis.reqHeaderUrls[this.id] ||
      context.$config.europeana.apis[this.id].url;
  }

  apiUrlFromRequestHeaders(headers) {
    return headers?.[`x-europeana-${kebabCase(this.id)}-api-url`];
  }
}

const runtimeConfig = {};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  if (!runtimeConfig[scope]) {
    runtimeConfig[scope] = Object.keys(APIS).reduce((memo, id) => {
      memo[id] = new EuropeanaApiEnvConfig(id, scope);
      return memo;
    }, {});
  }
  return runtimeConfig[scope];
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
