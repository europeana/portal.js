export default {
  state: () => ({
    bannerVisible: false
  }),

  mutations: {
    setVisibility(state, value) {
      state.bannerVisible = value;
    }
  },

  getters: {
    visible(state) {
      return state.bannerVisible;
    }
  }
};
