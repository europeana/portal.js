const setIdFromUri = (uri) => uri.split('/item').pop();

export const state = () => ({
  activeSet: null,
  likesId: null,
  liked: [],
  timestamps: {
    any: {
      created: null,
      updated: null,
      deleted: null,
      itemAdded: null,
      itemRemoved: null
    },
    active: {
      created: null,
      updated: null,
      deleted: null,
      itemAdded: null,
      itemRemoved: null
    }
  }
});

export const mutations = {
  setActiveSet(state, id) {
    state.activeSet = id;
  },
  // Timestamp modification of set data
  //
  // Numeric timestamps are updated when various set-related data were last modified
  // by the application. Watch the relevant state properties in components to react
  // to changes, e.g. by re-requesting source data from the Set API.
  //
  // Available actions to timestamp:
  // * created: a new set was created
  // * updated: an existing set was updated
  // * deleted: an existing set was deleted
  // * itemAdded: an item was added to a set
  // * itemRemoved: an item was removed from a set
  //
  // Why do this instead of storing the updated data itself? Because the Set API
  // is the source-of-truth, not the application. Also, scalability, e.g. for
  // paginated public sets.
  //
  // @param {Object} body Timestamp properties
  // @param {string} body.action Action to timestamp
  // @param {string} body.id ID of the set the action occurred on
  timestamp(state, body) {
    const timestamp = Date.now();
    state.timestamps.any[body.action] = timestamp;
    if (body.id === state.activeSet) state.timestamps.active[body.action] = timestamp;
  },
  setLikesId(state, value) {
    state.likesId = value;
  },
  setLikedItems(state, likesArray) {
    state.liked = likesArray;
  },
  like(state, value) {
    state.liked.push(value);
  },
  unlike(state, value) {
    state.liked.splice(state.liked.indexOf(value), 1);
  }
};

export const actions = {
  async like({ commit, state }, itemId) {
    await this.$sets.modifyItems('add', state.likesId, itemId);
    commit('like', itemId);
  },
  async unlike({ commit, state }, itemId) {
    await this.$sets.modifyItems('delete', state.likesId, itemId);
    commit('unlike', itemId);
  },
  async setLikes({ commit }) {
    const creator = this.$auth.user ? this.$auth.user.sub : null;
    const likesId = await this.$sets.getLikes(creator);

    if (likesId) {
      commit('setLikesId', likesId);
      const likedItems = await this.$sets.getSet(likesId, { profile: 'standard' })
        .then(response => response.items || []);
      commit('setLikedItems', likedItems.map(item => setIdFromUri(item)));
    }
  },
  async createLikes({ commit }) {
    const likesId = await this.$sets.createLikes().then(response =>  response.id.split('/').pop());
    commit('setLikesId', likesId);
  },
  // TODO: is this used?
  reset({ commit }) {
    commit('setLikedItems', []);
  }
};
