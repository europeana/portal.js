export default {
  state: () => ({
    active: false,
    collectionFacetEnabled: true,
    collectionLabel: null,
    showFiltersSheet: false,
    showFiltersToggle: false,
    showSearchBar: false,
    view: null
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
    }
  },

  getters: {
    activeView(state) {
      return state.view || 'grid';
    }
  }
};
