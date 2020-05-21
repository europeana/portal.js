export const state = () => ({
  showSearch: false,
  onDesktop: true,
  onMobile: false
});

export const mutations = {
  toggleSearchBar(state) {
    state.showSearch = !state.showSearch;
  },
  onDesktop(state, action) {
    state.onDesktop = action;
  },
  onMobile(state, action) {
    state.onMobile = action;
  }
};
