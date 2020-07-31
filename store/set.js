export const state = () => ({
  likesId: null
});

export const mutations = {
  setLikesId(state, value) {
    state.likesId = value;
  }
};
