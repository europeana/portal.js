export const state = () => ({
  showSearch: false,
  onDesktop: true
});

export const mutations = {
  toggleSearchBar(state) {
    state.showSearch = !state.showSearch;
  },
  onDesktop(state, action) {
    state.onDesktop = action;
  }
};

export const getters = {
  searchView(state) {
    return state.showSearch;
  },
  desktopCheck(state) {
    return state.onDesktop;
  }
};
