export default {
  state: () => ({
    title: null
  }),

  mutations: {
    setTitle(state, value) {
      state.title = value;
    }
  }
};
