export default {
  state: () => ({
    likesId: null,
    likedItems: null,
    likedItemIds: [],
    active: null,
    activeRecommendations: [],
    selectedItems: []
  }),

  mutations: {
    setLikesId(state, value) {
      state.likesId = value;
    },
    setLikedItems(state, value) {
      state.likedItems = value;
      // TODO should likedItemIds be reset to empty array when falsy value?
      if (value) {
        state.likedItemIds = value.map(item => item.id);
      }
    },
    like(state, itemId) {
      state.likedItemIds.push(itemId);
    },
    unlike(state, itemId) {
      state.likedItemIds.splice(state.likedItemIds.indexOf(itemId), 1);
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
      state.selectedItems.push(itemId);
    },
    deselectItem(state, itemId) {
      state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
    }
  },

  actions: {
    like({ dispatch, commit, state }, itemId) {
      // TODO: temporary prevention of addition of > 100 items; remove when no longer needed
      return dispatch('fetchLikes')
        .then(() => {
          if (state.likedItems && state.likedItems.length >= 100) {
            return Promise.reject(new Error('100 likes'));
          } else {
            return this.$apis.set.insertItem(state.likesId, itemId)
              .then(commit('like', itemId));
          }
        })
        .catch((e) => {
          dispatch('fetchLikes');
          throw e;
        });
    },
    async unlike({ dispatch, commit, state }, itemId) {
      try {
        await this.$apis.set.deleteItem(state.likesId, itemId);
        commit('unlike', itemId);
        dispatch('fetchLikes');
      } catch (e) {
        dispatch('fetchLikes');
        throw e;
      }
    },
    refreshSet({ state, dispatch }) {
      if (state.active) {
        dispatch('fetchActive', state.active.id);
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
