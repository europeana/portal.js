export default {
  state: () => ({
    likesId: null,
    active: null,
    activeRecommendations: [],
    selectedItems: []
  }),

  mutations: {
    setLikesId(state, value) {
      state.likesId = value;
    },
    setActive(state, value) {
      state.active = value;
    },
    setActiveRecommendations(state, value) {
      // Remove any recommendations that are already in the active set, because
      // the Recommendation API/Engine is broken.
      // TODO: remove if/when recommendations become useful.
      const activeSetItemIds = state.active?.items.map((item) => item.id) || [];
      state.activeRecommendations = value.filter((rec) => !activeSetItemIds.includes(rec.id));
    },
    addItemToActive(state, item) {
      state.active.items.push(item);
    },
    selectItem(state, itemId) {
      if (!state.selectedItems.includes(itemId)) {
        state.selectedItems.push(itemId);
      }
    },
    deselectItem(state, itemId) {
      state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
    }
  },

  actions: {
    refreshSet({ state, dispatch }) {
      if (state.active) {
        dispatch('fetchActive', state.active.id);
      }
    },
    async fetchActive({ commit }, setId) {
      try {
        await Promise.all([
          this.$apis.set.get(setId),
          this.$apis.set.getItems(setId)
        ]).then((responses) => {
          commit('setActive', {
            ...responses[0],
            items: responses[1]
          });
        });
      } catch (error) {
        if (process.server && error.statusCode) {
          this.app.context.res.statusCode = error.statusCode;
        }
        throw error;
      }
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
