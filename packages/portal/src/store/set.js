export default {
  state: () => ({
    likesId: null,
    likedItems: null,
    likedItemIds: [],
    active: null,
    activeId: null,
    activeParams: {},
    activeRecommendations: [],
    selectedItems: []
  }),

  mutations: {
    setLikesId(state, value) {
      state.likesId = value;
    },
    setLikedItems(state, value) {
      state.likedItems = value || null;
      state.likedItemIds = value?.map(item => item.id) || [];
    },
    setSelected(state, value) {
      state.selectedItems = value;
    },
    like(state, itemIds) {
      for (const itemId of [].concat(itemIds)) {
        state.likedItemIds.push(itemId);
      }
    },
    unlike(state, itemId) {
      state.likedItemIds.splice(state.likedItemIds.indexOf(itemId), 1);
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
      // Remove any recommendations that are already in the active set, because
      // the Recommendation API/Engine is broken.
      // TODO: remove if/when recommendations become useful.
      const activeSetItemIds = state.active?.items.map((item) => item.id) || [];
      state.activeRecommendations = value.filter((rec) => !activeSetItemIds.includes(rec.id));
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
    async like({ dispatch, commit, state }, itemIds) {
      itemIds = [].concat(itemIds);
      // TODO: temporary prevention of addition of > 100 items; remove when no longer needed
      await dispatch('fetchLikes');
      if (state.likedItems && state.likedItems.length >= 100) {
        throw new Error('100 likes');
      } else {
        try {
          await this.$apis.set.insertItems(state.likesId, itemIds);
          commit('like', itemIds);
          dispatch('fetchLikes');
        } catch (e) {
          dispatch('fetchLikes');
          throw e;
        }
      }
    },
    async unlike({ dispatch, commit, state }, itemId) {
      try {
        await this.$apis.set.deleteItems(state.likesId, itemId);
        commit('unlike', itemId);
        dispatch('fetchLikes');
      } catch (e) {
        dispatch('fetchLikes');
        throw e;
      }
    },
    async fetchLikes({ commit, state }) {
      if (!state.likesId) {
        return commit('setLikedItems', null);
      }

      const likes = await this.$apis.set.get(state.likesId, {
        pageSize: 100,
        profile: 'items.meta',
        page: 1
      }).catch(() => {
        return {};
      });

      return commit('setLikedItems', likes.items || []);
    },
    async fetchActive({ commit, state }) {
      if (!state.activeId) {
        return;
      }

      const responses = await Promise.all([
        this.$apis.set.get(state.activeId),
        this.$apis.set.getItems(state.activeId, state.activeParams)
      ]);

      return commit('setActive', {
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
