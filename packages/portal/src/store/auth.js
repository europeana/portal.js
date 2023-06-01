export const state = () => ({
  loggedIn: false,
  profile: {},
  resourceAccess: {}
});

export const mutations = {
  setLoggedIn(state, value) {
    console.log('setLoggedIn', value);
    state.loggedIn = value;
  },

  setProfile(state, value) {
    console.log('setProfile', value);
    state.profile = value;
  },

  setResourceAccess(state, value) {
    console.log('setResourceAccess', value);
    state.resourceAccess = value;
  }
};

export const getters = {
  userHasClientRole: (state) => (client, role) => {
    return state.resourceAccess[client]?.roles?.includes(role);
  }
};
