export const state = () => ({
  active: false,
  query: '',
  view: 'grid'
});

export const mutations = {
  setActive(state, value) {
    state.active = value;
  },
  setQuery(state, value) {
    state.query = value;
  },
  setView(state, value) {
    state.view = value;
  }
};
