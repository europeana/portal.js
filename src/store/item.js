export default {
  state: () => ({
    annotations: [],
    relatedEntities: [],
    similarItems: []
  }),

  mutations: {
    setAnnotations(state, value) {
      state.annotations = value;
    },
    setRelatedEntities(state, value) {
      state.relatedEntities = value;
    },
    setSimilarItems(state, value) {
      state.similarItems = value;
    }
  },

  getters: {
    annotationsByMotivation: (state) => (motivation) => {
      return state.annotations?.filter(annotation => annotation.motivation === motivation) || [];
    }
  },

  actions: {
    reset({ commit }) {
      commit('set', ['annotations', []]);
      commit('set', ['relatedEntities', []]);
      commit('set', ['similarItems', []]);
    }
  }
};
