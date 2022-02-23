import merge from 'deepmerge';
import themes from '@/plugins/europeana/themes';
import { BASE_URL as FULLTEXT_BASE_URL } from '@/plugins/europeana/newspaper';

// Default facets to always request and display.
// Order is significant as it will be reflected on search results.
export const defaultFacetNames = [
  'TYPE',
  'REUSABILITY',
  'COUNTRY',
  'LANGUAGE',
  'PROVIDER',
  'DATA_PROVIDER',
  'COLOURPALETTE',
  'IMAGE_ASPECTRATIO',
  'IMAGE_SIZE',
  'MIME_TYPE',
  'contentTier'
];

const filtersFromQf = (qfs) => {
  const filters = {};

  for (const qf of [].concat(qfs || [])) {
    const qfParts = qf.split(':');
    const name = qfParts[0];
    const value = qfParts.slice(1).join(':');
    if (typeof filters[name] === 'undefined') {
      filters[name] = [];
    }
    filters[name].push(value);
  }

  return filters;
};

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
    resettableFilters: [],
    results: [],
    showSearchBar: false,
    totalResults: null,
    userParams: {},
    view: null,
    showFiltersSheet: false,
    showFiltersToggle: false
  }),

  mutations: {
    addLiveQuery(state, query) {
      state.liveQueries.push(query);
    },
    removeLiveQuery(state, query) {
      state.liveQueries = state.liveQueries.filter(liveQuery => liveQuery !== query);
    },
    clearResettableFilters(state) {
      state.resettableFilters = [];
    },
    addResettableFilter(state, filterName) {
      if (!state.resettableFilters.includes(filterName)) {
        state.resettableFilters.push(filterName);
      }
    },
    removeResettableFilter(state, filterName) {
      const index = state.resettableFilters.indexOf(filterName);
      if (index !== -1) {
        state.resettableFilters.splice(index, 1);
      }
    },
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

    hasResettableFilters(state) {
      return state.resettableFilters.length > 0;
    },

    collection(state) {
      const collectionFilter = filtersFromQf(state.apiParams.qf).collection;
      return collectionFilter ? collectionFilter[0] : null;
    },

    theme(state, getters) {
      return themes.find(theme => theme.qf === getters.collection);
    },

    // TODO: do not assume filters are fielded, e.g. `qf=whale`
    filters: (state) => {
      const filters = filtersFromQf(state.userParams.qf);

      if (state.userParams.reusability) {
        filters['REUSABILITY'] = state.userParams.reusability.split(',');
      }

      if (state.apiParams.api) {
        filters['api'] = state.apiParams.api;
      }

      return filters;
    },

    searchOptions: (state) => {
      return {
        ...state.apiOptions,
        escape: (!state.userParams.query && !!state.overrideParams.query)
      };
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
    run({ dispatch }) {
      return dispatch('deriveApiSettings')
        .then(dispatch('queryItems'));
    },

    queryItems({ dispatch, state, getters, commit }) {
      const paramsForItems = {
        ...state.apiParams
      };
      delete paramsForItems.facet;

      commit('addLiveQuery', paramsForItems);
      return this.$apis.record.search(paramsForItems, { ...getters.searchOptions, locale: this.$i18n.locale })
        .then(async(response) => {
          await dispatch('updateForSuccess', response);
        })
        .catch(async(error) => {
          await dispatch('updateForFailure', error);
        })
        .finally(() => {
          commit('removeLiveQuery', paramsForItems);
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
    },

    async setResettableFilter({ commit }, { name, selected }) {
      if ((Array.isArray(selected) && selected.length === 0) || !selected) {
        await commit('removeResettableFilter', name);
      } else {
        await commit('addResettableFilter', name);
      }
    }
  }
};
