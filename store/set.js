const setIdFromUri = (uri) => uri.split('/item').pop();

export const state = () => ({
  likesId: null,
  liked: []
});

export const mutations = {
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
