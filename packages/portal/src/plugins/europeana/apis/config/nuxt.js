import { API_IDS } from '../index.js';
import EuropeanaApiEnvConfig from './env.js';

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
