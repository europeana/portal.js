import { APIS, API_IDS } from '../index.js';
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
      let from = privateNuxtRuntimeConfig[id].url;
      let to = publicNuxtRuntimeConfig[id].url || APIS[id].BASE_URL;
      if (id === 'record') {
        from = from.endsWith('/record') ? from : `${from}/record`;
        to = to.endsWith('/record') ? to : `${to}/record`;
      }

      memo.push({
        from,
        to
      });
    }
    return memo;
  }, []);
};
