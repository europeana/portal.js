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
      state.likedItems = value || null;
      state.likedItemIds = value?.map(item => item.id) || [];
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
    async fetchActive({ dispatch, commit, state }) {
      if (!state.activeId) {
        return;
      }

      // NOTE: Set API v0.12 has a bug where it will error if the set is empty,
      //       profile=itemDescriptions, and page param is set. Therefore, we have
      //       to get the set first, check if it's empty, and if so, not make
      //       the items request.
      // TODO: rm when v0.12 is replaced
      let responses = [];
      if (this.$apis.set.config.version === '0.12') {
        console.log('0.12');
        responses[0] = await this.$apis.set.get(state.activeId);
        if (responses[0].total > 0) {
          responses[1] = await this.$apis.set.getItems(state.activeId, state.activeParams);
        } else {
          responses[1] = [];
        }
      } else {
        responses = await Promise.all([
          this.$apis.set.get(state.activeId),
          this.$apis.set.getItems(state.activeId, state.activeParams)
        ]);
      }
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
