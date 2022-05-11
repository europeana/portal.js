export default {
  state: () => ({
    likesId: null,
    likedItems: null,
    likedItemIds: [],
    active: null,
    activeRecommendations: [],
    creations: [],
    curations: []
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
      state.activeRecommendations = value;
    },
    addItemToActive(state, item) {
      state.active.items.push(item);
    },
    setCreations(state, value) {
      state.creations = value;
    },
    setCurations(state, value) {
      state.curations = value;
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
      commit('setCreations', []);
      commit('setCurations', []);
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
    unlike({ dispatch, commit, state }, itemId) {
      return this.$apis.set.modifyItems('delete', state.likesId, itemId)
        .then(commit('unlike', itemId))
        .then(() => {
          return dispatch('fetchLikes');
        })
        .catch(() => {
          return dispatch('fetchLikes');
        });
    },
    addItem({ dispatch }, { setId, itemId }) {
      return this.$apis.set.modifyItems('add', setId, itemId)
        .then(() => {
          dispatch('refreshCreation', setId);
        })
        .catch(() => {
          dispatch('refreshCreation', setId);
        });
    },
    removeItem({ dispatch }, { setId, itemId }) {
      return this.$apis.set.modifyItems('delete', setId, itemId)
        .then(() => {
          dispatch('refreshCreation', setId);
        })
        .catch(() => {
          dispatch('refreshCreation', setId);
        });
    },
    setLikes({ commit }) {
      return this.$apis.set.getLikes(this.$auth.user ? this.$auth.user.sub : null)
        .then(likesId => commit('setLikesId', likesId));
    },
    createLikes({ commit }) {
      return this.$apis.set.createLikes()
        .then(response => commit('setLikesId', response.id));
    },
    refreshSet({ state, dispatch }) {
      if (state.active) {
        dispatch('fetchActive', state.active.id);
      }
    },
    fetchLikes({ commit, state }) {
      if (!state.likesId) {
        return commit('setLikedItems', null);
      }

      return this.$apis.set.get(state.likesId, {
        pageSize: 100,
        profile: 'standard'
      }, { withMinimalItems: true })
        .then(likes => commit('setLikedItems', likes.items || []));
    },
    async fetchActive({ commit }, setId) {
      try {
        const set = await this.$apis.set.get(setId, {
          pageSize: 100,
          profile: 'standard'
        }, { withMinimalItems: true });
        commit('setActive', set);
      } catch (error) {
        if (process.server && error.statusCode) {
          this.app.context.res.statusCode = error.statusCode;
        }
        throw error;
      }
    },
    createSet({ dispatch }, body) {
      return this.$apis.set.create(body)
        .then(() => dispatch('fetchCreations'));
    },
    update({ state, commit }, { id, body }) {
      return this.$apis.set.update(id, body)
        .then(response => {
          if (state.active && id === state.active.id) {
            commit('setActive', { items: state.active.items, ...response });
          }
        });
    },
    deleteSet({ state, commit }, setId) {
      return this.$apis.set.deleteSet(setId)
        .then(() => {
          if (state.active && setId === state.active.id) {
            commit('setActive', 'DELETED');
          }
        });
    },
    refreshCreation({ state, commit }, setId) {
      const setToReplaceIndex = state.creations.findIndex(set => set.id === setId);
      if (setToReplaceIndex === -1) {
        return Promise.resolve();
      }

      return this.$apis.set.get(setId, {
        profile: 'standard'
      })
        .then(set => {
          const creations = [].concat(state.creations);
          creations[setToReplaceIndex] = set;

          commit('setCreations', creations);
        });
    },
    async fetchCreations({ commit }) {
      const creatorId = this.$auth.user ? this.$auth.user.sub : null;
      const searchParams = {
        query: `creator:${creatorId}`,
        profile: 'standard',
        pageSize: 100, // TODO: pagination?
        qf: 'type:Collection'
      };

      const searchResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      const sets = searchResponse.data.items || [];
      commit('setCreations', sets);
    },
    fetchCurations({ commit }) {
      const contributorId = this.$auth.user ? this.$auth.user.sub : null;
      const searchParams = {
        query: `contributor:${contributorId}`,
        profile: 'standard',
        pageSize: 100, // TODO: pagination?
        qf: 'type:EntityBestItemsSet'
      };

      return this.$apis.set.search(searchParams, { withMinimalItemPreviews: true })
        .then(searchResponse => commit('setCurations', searchResponse.data.items || []));
    },
    reviewRecommendation({ state, commit }, params) {
      return this.$apis.recommendation[params.action]('set', params.setId, params.itemIds)
        .then(response => {
          const recList = state.activeRecommendations.slice();
          const index = recList.findIndex(item => item.id === params.itemIds[0]);
          if (response.items.length > 0) {
            recList.splice(index, 1, response.items[0]);
          } else {
            recList.splice(index, 1);
          }

          commit('setActiveRecommendations', recList);
        });
    }
  }
};
