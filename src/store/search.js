import { diff } from 'deep-object-diff';
import merge from 'deepmerge';
import { escapeLuceneSpecials } from '../plugins/europeana/utils';
import { unquotableFacets } from '../plugins/europeana/search';

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
    facets: [],
    hits: null,
    lastAvailablePage: null,
    liveQueries: [],
    overrideParams: {},
    collectionLabel: null,
    previousApiOptions: null,
    previousApiParams: null,
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
    setFacets(state, value) {
      if (!value) {
        value = [];
      }
      for (const facet of value) {
        if (facet.name === 'REUSABILITY') {
          facet.fields = facet.fields.filter((field) => field.label !== 'uncategorized');
        }

        if (!unquotableFacets.includes(facet.name)) {
          for (const field of facet.fields) {
            field.label = '"' + escapeLuceneSpecials(field.label) + '"';
          }
        }
      }
      state.facets = value;
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

    formatFacetFieldLabel: (state, getters, rootState, rootGetters) => (facetName, facetFieldLabel) => {
      const collection = getters.collection;
      if (!getters.hasCollectionSpecificSettings(collection)) {
        return null;
      }
      if (!rootGetters[`collections/${collection}/formatFacetFieldLabel`]) {
        return null;
      }

      return rootGetters[`collections/${collection}/formatFacetFieldLabel`](facetName, facetFieldLabel);
    },

    facetNames(state) {
      return (state.apiParams.facet || '').split(',');
    },

    hasCollectionSpecificSettings: (state, getters, rootState) => (collection) => {
      return (!!collection) &&
        (!!rootState.collections && !!rootState.collections[collection]) &&
        ((rootState.collections[collection].enabled === undefined) || rootState.collections[collection].enabled);
    },

    hasResettableFilters(state) {
      return state.resettableFilters.length > 0;
    },

    collection(state) {
      const collectionFilter = filtersFromQf(state.apiParams.qf).collection;
      return collectionFilter ? collectionFilter[0] : null;
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

    apiParamsChanged: (state) => {
      return Object.keys(diff(state.previousApiParams, state.apiParams));
    },

    itemUpdateNeeded: (state, getters) => {
      if (!state.previousApiParams) {
        return true;
      } // i.e. if this is the first search
      return getters.apiParamsChanged
        .some((param) => ['page', 'query', 'qf', 'api', 'reusability'].includes(param));
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
    async deriveApiSettings({ commit, dispatch, state, getters, rootGetters }) {
      // Coerce qf from user input into an array as it may be a single string
      const userParams = Object.assign({}, state.userParams || {});
      userParams.qf = [].concat(userParams.qf || []);

      const apiParams = merge(userParams, state.overrideParams || {});
      if (!apiParams.facet) {
        apiParams.facet = defaultFacetNames.join(',');
      }

      if (!apiParams.profile) {
        apiParams.profile = 'minimal';
      }

      const apiOptions = {};

      commit('set', ['previousApiParams', Object.assign({}, state.apiParams)]);
      commit('set', ['previousApiOptions', Object.assign({}, state.apiOptions)]);

      commit('set', ['apiParams', apiParams]);
      commit('set', ['apiOptions', apiOptions]);

      if (getters.collection || rootGetters['entity/id']) {
        await dispatch('applyCollectionSpecificSettings');
      }
    },

    applyCollectionSpecificSettings({ commit, getters, rootGetters, rootState, state }) {
      const collection = getters.collection;
      if (!getters.hasCollectionSpecificSettings(collection)) {
        return;
      }

      for (const property of ['apiParams', 'apiOptions']) {
        if (rootState.collections[collection][property] !== undefined) {
          commit(`collections/${collection}/set`, [property, state[property]], { root: true });
          commit('set', [property, rootGetters[`collections/${collection}/${property}`]]);
        }
      }
    },

    /**
     * Run a Record API search and store the results
     */
    async run({ dispatch, getters }) {
      await dispatch('deriveApiSettings');

      return getters.itemUpdateNeeded ? dispatch('queryItems') : Promise.resolve();
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

    queryFacet({ commit, getters, rootState, rootGetters, dispatch, state }, facet) {
      const paramsForFacets = {
        ...state.apiParams,
        rows: 0,
        profile: 'facets',
        facet
      };

      commit('addLiveQuery', paramsForFacets);
      return this.$apis.record.search(paramsForFacets, { ...getters.searchOptions, locale: this.$i18n.locale })
        .then((response) => {
          commit('setFacets', response.facets);
          const collection = getters.collection;

          if (getters.hasCollectionSpecificSettings(collection) && rootState.collections[collection]['facets'] !== undefined) {
            commit(`collections/${collection}/set`, ['facets', state.facets], { root: true });
            commit('set', ['facets', rootGetters[`collections/${collection}/facets`]]);
          }

          return state.facets;
        })
        .catch(async(error) => {
          await dispatch('updateForFailure', error);
        })
        .finally(() => {
          commit('removeLiveQuery', paramsForFacets);
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
      commit('setFacets', []);
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
