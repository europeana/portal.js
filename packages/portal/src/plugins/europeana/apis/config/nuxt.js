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
