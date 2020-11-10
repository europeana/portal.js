export const state = () => ({
  likesId: null,
  likedItems: null,
  likedItemIds: [],
  active: null,
  creations: []
});

export const mutations = {
  setLikesId(state, value) {
    state.likesId = value;
  },
  setLikedItems(state, value) {
    state.likedItems = value;
    if (value) state.likedItemIds = value.map(item => item.id);
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
  addItemToActive(state, item) {
    state.active.items.push(item);
  },
  setCreations(state, value) {
    state.creations = value;
  }
};

export const getters = {
  isLiked: (state) => (itemId) => {
    return state.likedItemIds.includes(itemId);
  }
};

export const actions = {
  reset({ commit }) {
    commit('setLikesId', null);
    commit('setLikedItems', null);
    commit('setCreations', []);
  },
  like({ dispatch, commit, state }, itemId) {
    // TODO: temporary prevention of addition of > 100 items; remove when no longer needed
    return dispatch('fetchLikes')
      .then(() => {
        if (state.likedItems && state.likedItems.length >= 100) {
          throw new Error('100 likes');
        }
      })
      .then(() => {
        return this.$sets.modifyItems('add', state.likesId, itemId)
          .then(commit('like', itemId));
      });
  },
  unlike({ commit, state }, itemId) {
    return this.$sets.modifyItems('delete', state.likesId, itemId)
      .then(commit('unlike', itemId));
  },
  addItem({ dispatch }, { setId, itemId }) {
    return this.$sets.modifyItems('add', setId, itemId)
      .then(() => {
        dispatch('refreshCreation', setId);
      });
  },
  removeItem({ dispatch }, { setId, itemId }) {
    return this.$sets.modifyItems('delete', setId, itemId)
      .then(() => {
        dispatch('refreshCreation', setId);
      });
  },
  setLikes({ commit }) {
    return this.$sets.getLikes(this.$auth.user ? this.$auth.user.sub : null)
      .then(likesId => commit('setLikesId', likesId));
  },
  createLikes({ commit }) {
    return this.$sets.createLikes()
      .then(response => commit('setLikesId', response.id));
  },
  refreshSet({ state, dispatch }) {
    if (state.active) {
      dispatch('fetchActive', state.active.id);
    }
  },
  fetchLikes({ commit, state }) {
    if (!state.likesId) return commit('setLikedItems', null);

    return this.$sets.getSet(state.likesId, {
      pageSize: 100,
      profile: 'itemDescriptions'
    })
      .then(likes => commit('setLikedItems', likes.items || []));
  },
  fetchActive({ commit }, setId) {
    return this.$sets.getSet(setId, {
      profile: 'itemDescriptions'
    })
      .then(set => commit('setActive', set));
  },
  createSet({ dispatch }, body) {
    return this.$sets.createSet(body)
      .then(() => dispatch('fetchCreations'));
  },
  updateSet({ state, commit }, { id, body }) {
    return this.$sets.updateSet(id, body)
      .then(response => {
        if (state.active && id === state.active.id) commit('setActive', { items: state.active.items, ...response });
      });
  },
  deleteSet({ state, commit }, setId) {
    return this.$sets.deleteSet(setId)
      .then(() => {
        if (state.active && setId === state.active.id) commit('setActive', 'DELETED');
      });
  },
  refreshCreation({ state, commit }, setId) {
    const setToReplaceIndex = state.creations.findIndex(set => set.id === setId);
    if (setToReplaceIndex === -1) return;

    return this.$sets.getSet(setId, {
      profile: 'itemDescriptions'
    })
      .then(set => {
        const creations = [].concat(state.creations);
        creations[setToReplaceIndex] = set;
        commit('setCreations', creations);
      });
  },
  fetchCreations({ commit }) {
    const creatorId = this.$auth.user ? this.$auth.user.sub : null;
    const searchParams = {
      query: `creator:${creatorId}`,
      profile: 'itemDescriptions',
      pageSize: 100, // TODO: pagination?
      qf: 'type:Collection'
    };

    return this.$sets.search(searchParams)
      .then(searchResponse => commit('setCreations', searchResponse.data.items || []));
  }
};
