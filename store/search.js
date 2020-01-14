import merge from 'deepmerge';
import search from '../plugins/europeana/search';
import apiConfig from '../plugins/europeana/api';

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
  setApiOptions(state, value) {
    state.apiOptions = value;
  },
  setApiParams(state, value) {
    state.apiParams = value;
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

  async deriveApiSettings({ commit, dispatch, state }) {
    // Coerce qf from user input into an array as it may be a single string
    const userParams = Object.assign({}, state.userParams || {});
    userParams.qf = [].concat(userParams.qf || []);

    const apiParams = merge(userParams, state.overrideParams || {});
    commit('setApiParams', apiParams);
    commit('setApiOptions', {});

    if (apiParams.theme === 'newspaper') {
      await dispatch('deriveApiSettingsForNewspaperTheme');
    }
  },

  deriveApiSettingsForNewspaperTheme({ commit, state }) {
    const apiParams = Object.assign({}, state.apiParams);
    const apiOptions = Object.assign({}, state.apiOptions);

    // Ensure newspapers collection gets fulltext API by default
    if (!apiParams.api) {
      apiParams.api = 'fulltext';
    }

    if (apiParams.api === 'fulltext') {
      // TODO: fulltext search API should be aware of contentTier, but is not.
      //       If & when it is, this can be removed.
      apiParams.qf = ([].concat(apiParams.qf)).filter(qf => !/^contentTier:/.test(qf));
      apiParams.qf.push('contentTier:*');

      apiOptions.origin = apiConfig.newspaper.origin;
      apiParams.wskey = apiConfig.newspaper.key;
    }

    commit('setApiParams', apiParams);
    commit('setApiOptions', apiOptions);
  },

  /**
   * Run a Record API search and store the results
   */
  async run({ dispatch, state }) {
    await dispatch('deriveApiSettings');

    await search(state.apiParams || {}, state.apiOptions || {})
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
