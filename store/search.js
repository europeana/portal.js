export const state = () => ({
  active: false,
  query: ''
});

export const mutations = {
  setActive(state, value) {
    state.active = value;
  },
  setQuery(state, value) {
    state.query = value;
  }
};
