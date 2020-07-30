export const state = () => ({
  likesId: null
});

export const mutations = {
  setLikesId(state, value) {
    state.likesId = value;
  }
};

export const getters = {
  likesId(state) {
    return state.likesId ? state.likesId : '';
  }
};

