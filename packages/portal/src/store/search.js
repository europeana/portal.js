export default {
  state: () => ({
    active: false,
    collectionFacetEnabled: true,
    collectionLabel: null,
    showSearchSidebar: false,
    showSidebarToggle: false,
    showSearchBar: false,
    view: null,
    qasWithSelectedEntityValue: []
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
    setShowSearchSidebar(state, value) {
      state.showSearchSidebar = value;
    },
    setShowSidebarToggle(state, value) {
      state.showSidebarToggle = value;
    },
    addQasWithSelectedEntityValue(state, value) {
      state.qasWithSelectedEntityValue.push(value);
    },
    setQasWithSelectedEntityValue(state, value) {
      state.qasWithSelectedEntityValue = value;
    }
  },

  getters: {
    activeView(state) {
      return state.view || 'grid';
    }
  }
};
