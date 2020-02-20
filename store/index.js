import axios from 'axios';
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
  async nuxtServerInit({ commit, dispatch }, { req, route }) {
    const scheme = isHTTPS(req, true) ? 'https://' : 'http://';
    const origin = scheme + req.headers.host;
    commit('setCanonicalUrlOrigin', origin);
    commit('setCanonicalUrlPath', route.fullPath);

    await axios.all([
      dispatch('link-group/init'),
      dispatch('entity/init')
    ]);
  }
};
