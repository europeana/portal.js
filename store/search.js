import merge from 'deepmerge';
import search, { filtersFromQuery } from '../plugins/europeana/search';

export const state = () => ({
  active: false,
  apiOptions: {},
  apiParams: {},
  error: null,
  errorStatusCode: null,
  facets: [],
  filters: {},
  lastAvailablePage: null,
  overrideParams: {},
  pill: null,
  results: [],
  themeFacetEnabled: true,
  totalResults: null,
  userParams: {},
  view: null
});

export const mutations = {
  setUserParams(state, value) {
    state.userParams = value;
  },
  setOverrideParams(state, value) {
    state.overrideParams = value;
  },
  // TODO: should this be an action, triggering multiple mutations?
  deriveApiParams(state) {
    // Coax qf from user input into an array
    const userParams = Object.assign({}, state.userParams);
    userParams.qf = [].concat(userParams.qf || []);

    const apiParams = merge(userParams, state.overrideParams);
    if (!apiParams.wskey) apiParams.wskey = process.env.EUROPEANA_API_KEY;

    state.apiParams = apiParams;

    // TODO: any additional derived params, e.g. newspapers api, go here
  },
  deriveFilters(state) {
    state.filters = filtersFromQuery(state.userParams);
  },
  setApiOptions(state, value) {
    state.apiOptions = value;
  },
  disableThemeFacet(state) {
    state.themeFacetEnabled = false;
  },
  enableThemeFacet(state) {
    state.themeFacetEnabled = true;
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
  setResults(state, value) {
    state.results = value;
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
  },
  setPill(state, value) {
    state.pill = value;
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

// TODO: add new action or mutation to start a new search, i.e. reset all options and params?
export const actions = {
  activate({ commit }) {
    commit('setActive', true);
  },

  async deactivate({ commit, dispatch }) {
    commit('setActive', false);
    await dispatch('reset');
  },

  reset({ commit }) {
    commit('setApiOptions', {});
    commit('setUserParams', {});
    commit('setOverrideParams', {});
    commit('setPill', null);
  },

  /**
   * Run a Record API search and store the results
   * @param {Object} commit commit from Vuex context
   * @param {Object} dispatch dispatch from Vuex context
   * @param {Object} state state from Vuex context
   */
  async run({ commit, dispatch, state }) {
    commit('deriveApiParams');
    commit('deriveFilters');

    await search(state.apiParams, state.apiOptions)
      .then((response) => dispatch('updateForSuccess', response))
      .catch((error) => dispatch('updateForFailure', error));
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
