import search, { selectedFacetsFromQuery } from '../plugins/europeana/search';

export const state = () => ({
  active: false,
  error: null,
  errorStatusCode: null,
  facets: [],
  lastAvailablePage: null,
  page: 1,
  qf: [],
  query: '',
  results: [],
  reusability: null,
  selectedFacets: {},
  totalResults: null,
  view: null
});

export const mutations = {
  // TODO: unused at present; consider removing
  reset(state) {
    state.error = null;
    state.errorStatusCode = null;
    state.facets = [];
    state.lastAvailablePage = null;
    state.page = 1;
    state.qf = [];
    state.query = '';
    state.results = [];
    state.reusability = null;
    state.selectedFacets = {};
    state.totalResults = null;
  },
  setActive(state, value) {
    state.active = value;
  },
  setError(state, value) {
    state.error = value;
  },
  setErrorStatusCode(state, value) {
    state.errorStatusCode = value;
  },
  setFacets(state, value) {
    state.facets = value;
  },
  setLastAvailablePage(state, value) {
    state.lastAvailablePage = value;
  },
  setPage(state, value) {
    state.page = Number(value);
  },
  setQf(state, value) {
    state.qf = value;
  },
  setQuery(state, value) {
    state.query = value;
  },
  setResults(state, value) {
    state.results = value;
  },
  setReusability(state, value) {
    state.reusability = value;
  },
  setSelectedFacets(state, value) {
    state.selectedFacets = value;
  },
  setTotalResults(state, value) {
    state.totalResults = value;
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
  activeView(state) {
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

export const actions = {
  /**
   * Run a Record API search and store the results
   * @param {Object} commit commit from Vuex context
   * @param {Object} dispatch dispatch from Vuex context
   * @param {Object} params parameters for search
   */
  async run({ commit, dispatch }, params) {
    const hiddenParams = params.hidden || {};
    delete params.hidden;

    commit('setPage', params.page || 1);
    commit('setQf', params.qf);
    commit('setQuery', params.query);
    commit('setReusability', params.reusability);
    commit('setSelectedFacets', selectedFacetsFromQuery(params));

    params.qf = (hiddenParams.qf || []).concat(params.qf || []);
    if (hiddenParams.theme) {
      params.theme = hiddenParams.theme;
    }

    await search({
      ...params,
      wskey: process.env.EUROPEANA_API_KEY
    })
      .then((response) => {
        dispatch('updateForSuccess', response);
      })
      .catch((error) => {
        dispatch('updateForFailure', error);
      });
  },
  updateForSuccess({ commit }, response) {
    commit('setError', response.error);
    commit('setErrorStatusCode', null);
    commit('setFacets', response.facets);
    commit('setLastAvailablePage', response.lastAvailablePage);
    commit('setResults', response.results);
    commit('setTotalResults', response.totalResults);
  },
  updateForFailure({ commit }, error) {
    commit('setError', error.message);
    commit('setErrorStatusCode', (typeof error.statusCode !== 'undefined') ? error.statusCode : 500);
    commit('setFacets', []);
    commit('setLastAvailablePage', null);
    commit('setResults', []);
    commit('setTotalResults', null);
  }
};
