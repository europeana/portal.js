export default {
  state: () => ({
    data: {}
  }),

  mutations: {
    set(state, value) {
      state.data = value || {};
    }
  }
};
