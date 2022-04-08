export default {
  state: () => ({
    id: null,
    annotations: [],
    relatedEntities: [],
    allRelatedEntities: [],
    featuredSetIds: {},
    featuredSetPins: {},
    similarItems: []
  }),

  mutations: {
    setId(state, value) {
      state.id = value;
    },
    setAnnotations(state, value) {
      state.annotations = value;
    },
    setRelatedEntities(state, value) {
      state.relatedEntities = value;
    },
    setAllRelatedEntities(state, value) {
      state.allRelatedEntities = value;
    },
    setFeaturedSetIds(state, value) {
      // used in reset only.
      state.featuredSetIds = value;
    },
    addToFeaturedSetIds(state, { entityUri, setId }) {
      state.featuredSetIds[entityUri] = setId;
    },
    setFeaturedSetPins(state, value) {
      // used in reset only.
      state.featuredSetPins = value;
    },
    addToFeaturedSetPins(state, { entityUri, pins }) {
      state.featuredSetPins[entityUri] = pins;
    },
    addPinToFeaturedSetPins(state, { entityUri, pin }) {
      state.featuredSetPins[entityUri].push(pin);
    },
    setSimilarItems(state, value) {
      state.similarItems = value;
    }
  },

  getters: {
    featuredSetIds(state) {
      return state.featuredSetIds;
    },

    featuredSetPins(state) {
      return state.featuredSetPins;
    },

    pinnedTo: (state, getters) => (entityUri) => {
      return getters.featuredSetPins[entityUri]?.includes(getters.id);
    },

    id(state) {
      return state.id ? state.id : null;
    },

    allRelatedEntities(state) {
      state.allRelatedEntities ? state.allRelatedEntities : null;
    },

    annotationsByMotivation: (state) => (motivation) => {
      return state.annotations?.filter(annotation => annotation.motivation === motivation) || [];
    },

    entityPreview: (state) => (uri) => {
      let entity = state.allRelatedEntities?.find(entity => entity.identifier === uri);
      if (!entity) {
        return;
      }
      return entity.isShownBy ? entity.isShownBy : (entity.logo ? entity.logo : null);
    }
  },

  actions: {
    reset({ commit }) {
      commit('id', null);
      commit('setAnnotations', []);
      commit('setRelatedEntities', []);
      commit('setAllRelatedEntities', []);
      commit('setfeaturedSetIds', {});
      commit('setfeaturedSetPins', {});
      commit('setSimilarItems', []);
    }
  }
};
