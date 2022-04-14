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
      console.log('in store addPinToFeaturedSetPins');
      console.log(state.featuredSetPins[entityUri]);
      state.featuredSetPins[entityUri].push(pin); // pin will likely always be state.id
    },
    setSimilarItems(state, value) {
      state.similarItems = value;
    }
  },

  getters: {
    pinnedTo: (state) => (entityUri) => {
      return state.featuredSetPins[entityUri]?.includes(state.id);
    },

    id(state) {
      return state.id ? state.id : null;
    },

    annotationsByMotivation: (state) => (motivation) => {
      return state.annotations?.filter(annotation => annotation.motivation === motivation) || [];
    }
  },

  actions: {
    reset({ commit }) {
      commit('setId', { value: null });
      commit('setAnnotations', []);
      commit('setRelatedEntities', []);
      commit('setAllRelatedEntities', []);
      commit('setFeaturedSetIds', { value: {} });
      commit('setFeaturedSetPins', { value: {} });
      commit('setSimilarItems', []);
    }
  }
};
