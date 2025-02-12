export default {
  state: () => ({
    likesId: null,
    likedItems: null,
    likedItemIds: [],
    active: null,
    activeRecommendations: []
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
    }
  },

  getters: {
    isLiked: (state) => (itemId) => {
      return state.likedItemIds.includes(itemId);
    }
  },

  actions: {
    reset({ commit }) {
      commit('setLikesId', null);
      commit('setLikedItems', null);
    },
    like({ dispatch, commit, state }, itemId) {
      // TODO: temporary prevention of addition of > 100 items; remove when no longer needed
      return dispatch('fetchLikes')
        .then(() => {
          if (state.likedItems && state.likedItems.length >= 100) {
            return Promise.reject(new Error('100 likes'));
          } else {
            return this.$apis.set.modifyItems('add', state.likesId, itemId)
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
        await this.$apis.set.modifyItems('delete', state.likesId, itemId);
        commit('unlike', itemId);
        dispatch('fetchLikes');
      } catch (e) {
        dispatch('fetchLikes');
        throw e;
      }
    },
    async removeItem(ctx, { setId, itemId }) {
      await this.$apis.set.modifyItems('delete', setId, itemId);
    },
    async setLikes({ commit }) {
      const likesId = await this.$apis.set.getLikes(this.$auth.user ? this.$auth.user.sub : null);
      commit('setLikesId', likesId);
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
        profile: 'itemDescriptions'
      }).catch(() => {
        return {};
      });
      return commit('setLikedItems', likes.items || []);
    },
    async fetchActive({ commit }, setId) {
      try {
        const set = await this.$apis.set.get(setId, {
          pageSize: 100,
          profile: 'itemDescriptions'
        });
        commit('setActive', set);
      } catch (error) {
        if (process.server && error.statusCode) {
          this.app.context.res.statusCode = error.statusCode;
        }
        throw error;
      }
    },
    async createSet(ctx, body) {
      await this.$apis.set.create(body);
    },
    async update({ state, commit }, { id, body, params }) {
      const response = await this.$apis.set.update(id, body, params);

      // Check if updated set is active set
      if (state.active && (state.active.id === id)) {
        // Respect reordering of items in update
        let items = state.active.items;
        if (response.items) {
          items = response.items.map(itemId => state.active.items.find(item => itemId.endsWith(item.id)));
        }
        commit('setActive', { ...response, items });
      }
    },
    async publish({ state, commit }, id) {
      const response = await this.$apis.set.publish(id);

      if (state.active && (state.active.id === id)) {
        commit('setActive', { ...state.active, ...response });
      }
    },
    async unpublish({ state, commit }, id) {
      const response = await this.$apis.set.unpublish(id);

      if (state.active && (state.active.id === id)) {
        commit('setActive', { ...state.active, ...response });
      }
    },
    async delete({ state, commit }, setId) {
      await this.$apis.set.delete(setId);
      if (state.active && setId === state.active.id) {
        commit('setActive', 'DELETED');
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
