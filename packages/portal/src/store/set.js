export default {
  state: () => ({
    likesId: null,
    likedItems: null,
    likedItemIds: [],
    active: null,
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
    setLikedItems(state, value) {
      state.likedItems = value;
      // TODO should likedItemIds be reset to empty array when falsy value?
      if (value) {
        state.likedItemIds = value.map((item) => item.id);
      }
    },
    setSelected(state, value) {
      state.selectedItems = value;
    },
    like(state, itemIds) {
      for (const itemId of [].concat(itemIds)) {
        if (!state.likedItemIds.includes(itemId)) {
          state.likedItemIds.push(itemId);
        }
      }
    },
    unlike(state, itemIds) {
      for (const itemId of [].concat(itemIds)) {
        state.likedItemIds.splice(state.likedItemIds.indexOf(itemId), 1);
      }
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
    async unlike({ dispatch, commit, state }, itemIds) {
      itemIds = [].concat(itemIds);
      try {
        await this.$apis.set.deleteItems(state.likesId, itemIds);
        commit('unlike', itemIds);
        dispatch('fetchLikes');
      } catch (e) {
        dispatch('fetchLikes');
        throw e;
      }
    },
    async refreshSet({ state, dispatch }) {
      if (state.active) {
        await dispatch('fetchActive', state.active.id);
        if (state.selectedItems.length > 0) {
          dispatch('refreshSelected');
        }
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
      const index = recList.findIndex((item) => item.id === params.itemIds[0]);
      if (response.items.length > 0) {
        recList.splice(index, 1, response.items[0]);
      } else {
        recList.splice(index, 1);
      }

      commit('setActiveRecommendations', recList);
    },
    refreshSelected({ state, commit }) {
      const activeItemsAndRecommendations = state.activeRecommendations.concat(state.active?.items || []).map((item) => item.id);
      const activeSelectedItems = state.selectedItems.filter((item) => activeItemsAndRecommendations.includes(item));

      commit('setSelected', activeSelectedItems);
    }
  }
};
