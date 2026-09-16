export default {
  state: () => ({
    editable: false,
    id: null
  }),

  mutations: {
    setId(state, value) {
      state.id = value;
    },
    setEditable(state, value) {
      state.editable = value;
    }
  }
};
