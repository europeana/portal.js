export const state = () => ({
  likesId: null,
  likedItems: [],
  active: null,
  creations: []
});

export const mutations = {
  setLikesId(state, value) {
    state.likesId = value;
  },
  setLikedItems(state, value) {
    state.likedItems = value;
  },
  like(state, value) {
    state.likedItems.push(value);
  },
  unlike(state, value) {
    state.likedItems.splice(state.likedItems.indexOf(value), 1);
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
    return state.likedItems.map(item => item.id).includes(itemId);
  }
};

export const actions = {
  reset({ commit }) {
    commit('setLikesId', null);
    commit('setLikedItems', []);
    commit('setCreations', []);
  },
  like({ commit, state }, itemId) {
    return this.$sets.modifyItems('add', state.likesId, itemId)
      .then(() => {
        commit('like', itemId);
      });
  },
  unlike({ commit, state }, itemId) {
    return this.$sets.modifyItems('delete', state.likesId, itemId)
      .then(() => {
        commit('unlike', itemId);
      });
  },
  addItem({ state, dispatch }, { setId, itemId }) {
    return this.$sets.modifyItems('add', setId, itemId)
      .then(() => {
        if (setId === state.active.id) dispatch('fetchActive', setId);
      });
  },
  removeItem({ state, dispatch }, { setId, itemId }) {
    return this.$sets.modifyItems('delete', setId, itemId)
      .then(() => {
        if (setId === state.active.id) dispatch('fetchActive', setId);
      });
  },
  setLikes({ commit }) {
    return this.$sets.getLikes(this.$auth.user ? this.$auth.user.sub : null)
      .then(likesId => {
        commit('setLikesId', likesId);
      });
  },
  createLikes({ commit }) {
    return this.$sets.createLikes()
      .then(response => {
        commit('setLikesId', response.id);
      });
  },
  fetchLikes({ commit, state }) {
    if (!state.likesId) return;

    return this.$sets.getSet(state.likesId, {
      pageSize: 100,
      profile: 'itemDescriptions'
    })
      .then(likes => {
        commit('setLikedItems', likes.items);
      });
  },
  fetchActive({ commit }, setId) {
    return this.$sets.getSet(setId, {
      profile: 'itemDescriptions'
    })
      .then(set => {
        commit('setActive', set);
      });
  },
  createSet({ dispatch }, setBody) {
    return this.$sets.createSet(setBody)
      .then(() => {
        dispatch('fetchCreations');
      });
  },
  updateSet({ state, commit }, { id, body }) {
    return this.$sets.updateSet(id, body)
      .then(response => {
        if (id === state.active.id) commit('setActive', { items: state.active.items, ...response });
      });
  },
  deleteSet({ state, commit }, setId) {
    return this.$sets.deleteSet(setId)
      .then(() => {
        if (setId === state.active.id) commit('setActive', null);
      });
  },
  fetchCreations({ commit }) {
    const creatorId = this.$auth.user ? this.$auth.user.sub : null;
    const searchParams = {
      query: `creator:${creatorId}`,
      profile: 'itemDescriptions',
      pageSize: 100 // TODO: pagination?
    };

    return this.$sets.search(searchParams)
      .then(searchResponse => {
        commit('setCreations', searchResponse.data.items || []);
      });
  }
};
