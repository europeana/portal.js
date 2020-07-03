import config from './config';

export const isHttps = ({ req }) => {
  if (process.client) {
    return (window.location.protocol === 'https:');
  }

  // Custom, non-standard header set by our gateway because gorouter on IBM
  // Cloud overwrites x-forwarded-proto
  if (req.headers['x-forwarded-protocol']) return req.headers['x-forwarded-protocol'] === 'https';

  if (req.headers['x-forwarded-proto']) return !req.headers['x-forwarded-proto'].split(',').includes('http');

  if (req.connection.encrypted === true) return true;

  if (req.protocol === 'https') return true;

  return false;
};

export const currentHost = ({ req }) => {
  if (process.client) {
    return window.location.host;
  }
  return req.headers['x-forwarded-host'] || req.headers.host;
};

export const currentProtocol = ({ req }) => {
  return isHttps({ req }) ? 'https:' : 'http:';
};

export const requestOrigin = (req) => {
  return currentProtocol({ req }) + '//' + currentHost({ req });
};

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

const storeModule = {
  namespaced: true,
  state: () => ({
    protocol: null,
    path: null,
    host: null,
    httpPort: '',
    httpsPort: ''
  }),
  mutations: {
    set(state, payload) {
      state[payload[0]] = payload[1];
    }
  },
  getters: {
    canonicalUrl(state, getters) {
      return getters.origin + state.path;
    },
    canonicalUrlWithoutLocale(state, getters) {
      return getters.canonicalUrl.replace(/(:\/\/[^/]+)\/[a-z]{2}(\/|$)/, '$1$2');
    },
    origin(state) {
      return `${state.protocol}//${state.host}`;
    }
  },
  actions: {
    init({ commit }, { req, route }) {
      const protocol = currentProtocol({ req });
      const host = currentHost({ req });
      const path = route.fullPath;

      const httpPort = config.ports.http ? `:${config.ports.http}` : '';
      const httpsPort = config.ports.https ? `:${config.ports.https}` : '';

      commit('set', ['protocol', protocol]);
      commit('set', ['host', host]);
      commit('set', ['path', path]);
      commit('set', ['httpPort', httpPort]);
      commit('set', ['httpsPort', httpsPort]);
    }
  }
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
