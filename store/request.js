const parseDomain = require('parse-domain');

export const state = () => ({
  domain: null
});

export const mutations = {
  SET_DOMAIN(state, value) {
    const currentDomain = parseDomain(value);
    state.domain = currentDomain ? [currentDomain.domain, currentDomain.tld].join('.') : null;
  }
};

export const actions = {
  async domain({ commit }, { req }) {
    commit('SET_DOMAIN', req.host);
  }
};
