export const state = () => ({
  login: false,
  logout: false
});

export const mutations = {
  login(state, value) {
    state.login = value;
    console.log('LOGIN ' + state.login);
  },
  logout(state, value) {
    state.logout = value;
    console.log('LOGOUT ' + state.logout);
  },
  resetStatus(state, value) {
    state.login = value;
    state.logout = value;
  }
};

export const getters = {
  isLoggedIn(state) {
    return state.login;
  },
  isLoggedOut(state) {
    return state.logout;
  }
};

export const actions = {
  login({ commit }, value) {
    commit('login', value);
  },
  logout({ commit }, value) {
    commit('logout', value);
  },
  resetStatus({ commit }, value) {
    commit('resetStatus', value);
  }
};

