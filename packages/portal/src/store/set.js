export default {
  state: () => ({
    likesId: null,
    active: null,
    activeId: null,
    activeParams: {},
    activeRecommendations: []
  }),

  mutations: {
    setLikesId(state, value) {
      state.likesId = value;
    },
    setActive(state, value) {
      state.active = value;
    },
    setActiveId(state, value) {
      state.activeId = value;
    },
    setActiveParams(state, value) {
      state.activeParams = value;
    },
    setActiveRecommendations(state, value) {
      state.activeRecommendations = value;
    }
  },

  actions: {
    async fetchActive({ commit, state }) {
      if (!state.activeId) {
        return;
      }

      const responses = await Promise.all([
        this.$apis.set.get(state.activeId),
        this.$apis.set.getItems(state.activeId, state.activeParams)
      ]);

      commit('setActive', {
        ...responses[0],
        items: responses[1]
      });
    },
    async reviewRecommendation({ state, commit }, params) {
      const response = await this.$apis.recommendation[params.action]('set', params.setId, params.itemIds);
      const recList = state.activeRecommendations.slice();
      const index = recList.findIndex(item => item.id === params.itemIds[0]);
      if (response.items.length > 0) {
        recList.splice(index, 1, response.items[0]);
      } else {
        recList.splice(index, 1);
      }

      commit('setActiveRecommendations', recList);
    }
  }
};
