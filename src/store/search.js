import themes from '@/plugins/europeana/themes';
import { filtersFromQf } from '@/plugins/europeana/search';
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
  'RIGHTS',
  'contentTier'
];

export default {
  state: () => ({
    active: false,
    collectionFacetEnabled: true,
    collectionLabel: null,
    liveQueries: [],
    showFiltersSheet: false,
    showFiltersToggle: false,
    showSearchBar: false,
    view: null
  }),

  mutations: {
    addLiveQuery(state, query) {
      state.liveQueries.push(query);
    },
    removeLiveQuery(state, query) {
      state.liveQueries = state.liveQueries.filter(liveQuery => liveQuery !== query);
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
    setShowSearchBar(state, value) {
      state.showSearchBar = value;
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
    }
  }
};
