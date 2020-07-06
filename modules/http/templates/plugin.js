import config from './config';

import { currentProtocol, currentHost, isHttps, requestOrigin } from './utils';

import storeModule from './store';

export const routeOnDatasetBlacklist = route => {
  if (!config.sslNegotiation.enabled || config.sslNegotiation.datasetBlacklist.length === 0) return false;
  if (typeof route !== 'object' || !route) return false;
  if (!/^item-all(___[a-z]{2})?$/.test(route.name)) return false;

  const dataset = route.params.pathMatch.split('/')[0];

  const datasetBlacklistRegExp = new RegExp(`^(${config.sslNegotiation.datasetBlacklist.join('|')})$`);
  return datasetBlacklistRegExp.test(dataset);
};

export const routePermittedOnEitherScheme = route => {
  if (typeof route !== 'object' || !route) return false;
  return /^iiif(___[a-z]{2})?$/.test(route.name);
};

const plugin = {
  config,
  currentHost,
  currentProtocol,
  isHttps,
  requestOrigin,
  routeOnDatasetBlacklist,
  routePermittedOnEitherScheme
};

export default ({ app, store }, inject) => {
  app.$http = plugin;
  inject('http', plugin);

  if (store) store.registerModule('http', storeModule);
};
