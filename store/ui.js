export const state = () => ({
  showSearch: false
});

export const mutations = {
  toggleSearchBar(state) {
    state.showSearch = !state.showSearch;
  }
};

export const getters = {
  searchView(state) {
    return state.showSearch;
  }
};
