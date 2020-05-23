export const state = () => ({
  showSearch: false
});

export const mutations = {
  toggleSearchBar(state) {
    state.showSearch = !state.showSearch;
  }
};
