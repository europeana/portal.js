export const state = () => ({
  login: false,
  logout: false
});

export const mutations = {
  userLoggedIn(state) {
    state.login = !state.login;
  },

  userLoggedOut(state) {
    state.logout = !state.logout;
  }

  // clearStatus(state) {
  //   console.log(state);
  //   state.login = false;
  //   state.logout = false;
  //   console.log('CLEARED');
  //   console.log(state);
  // }
};

export const getters = {
  isLoggedIn: (state) => {
    console.log('isLoggedIn');
    return state.login;
  },
  isLoggedOut: (state) => {
    console.log('isLoggedOut');
    return state.logout;
  }
};
