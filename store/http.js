import { currentProtocol, currentHost } from '../plugins/http';

export const state = () => ({
  protocol: null,
  path: null,
  host: null,
  httpPort: '',
  httpsPort: ''
});

export const mutations = {
  set(state, payload) {
    state[payload[0]] = payload[1];
  }
};

export const getters = {
  canonicalUrl(state, getters) {
    return getters.origin + state.path;
  },
  origin(state) {
    return `${state.protocol}//${state.host}`;
  }
};

export const actions = {
  init({ commit }, { req, route }) {
    const protocol = currentProtocol({ req });
    const host = currentHost({ req });
    const path = route.fullPath;

    const httpPort = process.env['HTTP_PORT'] ? `:${process.env['HTTP_PORT']}` : '';
    const httpsPort = process.env['HTTPS_PORT'] ? `:${process.env['HTTPS_PORT']}` : '';

    commit('set', ['protocol', protocol]);
    commit('set', ['host', host]);
    commit('set', ['path', path]);
    commit('set', ['httpPort', httpPort]);
    commit('set', ['httpsPort', httpsPort]);
  }
};
