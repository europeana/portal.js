export const state = () => ({
  likesId: null,
  liked: []
});

export const mutations = {
  setLikesId(state, value) {
    state.likesId = value;
  },
  addGallery(state, { likesArray }) {
    state.liked = likesArray;
  },
  like(state, value) {
    state.liked.push(value);
  },
  unlike(state, value) {
    state.liked.splice(state.liked.indexOf(value), 1);
  }
};
