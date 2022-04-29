import merge from 'deepmerge';
import { themes } from '@/plugins/europeana/themes';
import { filtersFromQf } from '@/plugins/europeana/search';
import { BASE_URL as FULLTEXT_BASE_URL } from '@/plugins/europeana/newspaper';

export default {
  state: () => ({
    active: false,
    apiOptions: {},
    apiParams: {},
    collectionFacetEnabled: true,
    error: null,
    errorStatusCode: null,
    hits: null,
    lastAvailablePage: null,
    liveQueries: [],
    overrideParams: {},
    collectionLabel: null,
    results: [],
    showSearchBar: false,
    allThemes: [],
    totalResults: null,
    userParams: {},
    view: null,
    showFiltersSheet: false,
    showFiltersToggle: false
  }),

  mutations: {
    disableCollectionFacet(state) {
      state.collectionFacetEnabled = false;
    },
    enableCollectionFacet(state) {
      state.collectionFacetEnabled = true;
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
    setHits(state, value) {
      state.hits = value;
    },
    setLastAvailablePage(state, value) {
      state.lastAvailablePage = value;
    },
    setResults(state, value) {
      state.results = value;
    },
    setShowSearchBar(state, value) {
      state.showSearchBar = value;
    },
    setTotalResults(state, value) {
      state.totalResults = value;
    },
    setView(state, value) {
      state.view = value;
    },
    setCollectionLabel(state, value) {
      state.collectionLabel = value;
    },
    setShowFiltersSheet(state, value) {
      state.showFiltersSheet = value;
    },
    setShowFiltersToggle(state, value) {
      state.showFiltersToggle = value;
    },
    set(state, payload) {
      state[payload[0]] = payload[1];
    }
  },

  getters: {
    activeView(state) {
      if (state.view) {
        return state.view;
      }
      return 'grid';
    },

    collection(state) {
      const collectionFilter = filtersFromQf(state.apiParams.qf).collection;
      return collectionFilter ? collectionFilter[0] : null;
    },

    theme(state, getters) {
      return themes.find(theme => theme.qf === getters.collection);
    }
  },

  actions: {
    activate({ commit }) {
      commit('setActive', true);
    },

    deactivate({ commit }) {
      commit('setActive', false);
    },

    // TODO: replace with a getter?
    deriveApiSettings({ commit, state, getters }) {
      // Coerce qf from user input into an array as it may be a single string
      const userParams = Object.assign({}, state.userParams || {});
      userParams.qf = [].concat(userParams.qf || []);

      const apiParams = merge(userParams, state.overrideParams || {});

      if (!apiParams.profile) {
        apiParams.profile = 'minimal';
      }

      // TODO: this happens once here, then again later, because `getters.collection`
      //       and hence `getters.theme` rely on it; refactor.
      commit('set', ['apiParams', { ...apiParams }]);

      const apiOptions = {};

      if (getters.theme?.filters?.api) {
        // Set default API (of fulltext or metadata), from theme config
        if (!apiParams.api) {
          apiParams.api = getters.theme.filters.api.default || 'fulltext';
        }
        if (apiParams.api === 'fulltext') {
          apiParams.profile = 'minimal,hits';
          apiOptions.url = FULLTEXT_BASE_URL;
        }
      }

      commit('set', ['apiParams', apiParams]);
      commit('set', ['apiOptions', apiOptions]);
    },

    /**
     * Run a Record API search and store the results
     */
    async run({ dispatch }) {
      await dispatch('deriveApiSettings');
      return dispatch('queryItems');
    },

    queryItems({ dispatch, state }) {
      const paramsForItems = {
        ...state.apiParams
      };
      delete paramsForItems.facet;

      return this.$apis.record.search(paramsForItems, { ...state.apiOptions, locale: this.$i18n.locale })
        .then(async(response) => {
          await dispatch('updateForSuccess', response);
        })
        .catch(async(error) => {
          await dispatch('updateForFailure', error);
        });
    },

    updateForSuccess({ commit }, response) {
      commit('setError', response.error);
      commit('setErrorStatusCode', null);
      commit('setHits', response.hits);
      commit('setLastAvailablePage', response.lastAvailablePage);
      commit('setResults', response.items);
      commit('setTotalResults', response.totalResults);
    },

    updateForFailure({ commit }, error) {
      commit('setError', error.message);
      commit('setErrorStatusCode', (typeof error.statusCode === 'undefined') ? 500 : error.statusCode);
      commit('setHits', null);
      commit('setLastAvailablePage', null);
      commit('setResults', []);
      commit('setTotalResults', null);
    }
  }
};
