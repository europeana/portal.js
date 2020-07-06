import { currentProtocol, currentHost } from './utils';

export default {
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
    init({ commit }, { req, route, $http }) {
      const protocol = currentProtocol({ req });
      const host = currentHost({ req });
      const path = route.fullPath;

      const httpPort = $http.config.ports.http ? `:${$http.config.ports.http}` : '';
      const httpsPort = $http.config.ports.https ? `:${$http.config.ports.https}` : '';

      commit('set', ['protocol', protocol]);
      commit('set', ['host', host]);
      commit('set', ['path', path]);
      commit('set', ['httpPort', httpPort]);
      commit('set', ['httpsPort', httpsPort]);
    }
  }
};
