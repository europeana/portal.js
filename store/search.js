export const state = () => ({
  active: false,
  query: '',
  view: null
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
