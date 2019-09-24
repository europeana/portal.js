export const state = () => ({
  active: false,
  page: 1,
  query: '',
  view: null
});

export const mutations = {
  newQuery(state, value) {
    state.query = value;
    state.page = 1;
  },
  setActive(state, value) {
    state.active = value;
  },
  setPage(state, value) {
    state.page = Number(value);
  },
  setQuery(state, value) {
    state.query = value;
  },
  setView(state, value) {
    state.view = value;
    if (process.browser) {
      sessionStorage.searchResultsView = value;
      localStorage.searchResultsView = value;
    }
  }
};

export const getters = {
  activeView: (state) => {
    if (state.view) {
      return state.view;
    } else if (process.browser) {
      if (sessionStorage.searchResultsView) {
        return sessionStorage.searchResultsView;
      } else if (localStorage.searchResultsView) {
        return localStorage.searchResultsView;
      }
    }
    return 'grid';
  }
};
