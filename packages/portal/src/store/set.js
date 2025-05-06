export default {
  state: () => ({
    likesId: null,
    active: null,
    activeId: null,
    activeParams: {},
    activeRecommendations: [],
    selectedItems: []
  }),

  getters: {
    activeSetItemIds(state) {
      return state.active?.items.map((item) => item.id) || [];
    },

    someActiveSetItemsSelected(state, getters) {
      return state.selectedItems.some((item) => getters.activeSetItemIds.includes(item));
    }
  },

  mutations: {
    setLikesId(state, value) {
      state.likesId = value;
    },
    setSelected(state, value) {
      state.selectedItems = value;
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
    async fetchActive({ dispatch, commit, state }) {
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

      if ((state.selectedItems || []).length > 0) {
        dispatch('refreshSelected');
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
    },
    refreshSelected({ state, commit }) {
      const activeItemsAndRecommendations = state.activeRecommendations.concat(state.active?.items || []).map(item => item.id);
      const activeSelectedItems = state.selectedItems.filter((item) => activeItemsAndRecommendations.includes(item));

      commit('setSelected', activeSelectedItems);
    }
  }
};
