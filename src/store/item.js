
export default {
  state: () => ({
    active: false,
    annotations: [],
    relatedEntities: [],
    similarItems: []
  }),

  mutations: {
    setActive(state, value) {
      state.active = value;
    },
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
    activate({ commit }) {
      commit('setActive', true);
    },

    async deactivate({ commit, dispatch }) {
      commit('setActive', false);
      await dispatch('reset');
    },

    reset({ commit }) {
      commit('set', ['annotations', []]);
      commit('set', ['relatedEntities', []]);
      commit('set', ['similarItems', []]);
    }
  }
};
