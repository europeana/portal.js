import { currentProtocol, currentHost } from '../plugins/http';

export const state = () => ({
  protocol: null,
  path: null,
  host: null
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

    commit('set', ['protocol', protocol]);
    commit('set', ['host', host]);
    commit('set', ['path', path]);
  }
};
