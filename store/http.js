import isHTTPS from 'is-https';

export const state = () => ({
  canonicalUrlOrigin: null,
  canonicalUrlPath: null
});

export const mutations = {
  setCanonicalUrlOrigin(state, value) {
    state.canonicalUrlOrigin = value;
  },
  setCanonicalUrlPath(state, value) {
    state.canonicalUrlPath = value;
  }
};

export const getters = {
  canonicalUrl(state) {
    return state.canonicalUrlOrigin + state.canonicalUrlPath;
  }
};

export const actions = {
  init({ commit }, { req, route }) {
    const scheme = isHTTPS(req, true) ? 'https://' : 'http://';
    const host = req.headers['X-Forwarded-Host'] || req.headers.host;
    const origin = scheme + host;
    commit('setCanonicalUrlOrigin', origin);
    commit('setCanonicalUrlPath', route.fullPath);
  }
};
