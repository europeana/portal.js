export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    await Promise.all([
      dispatch('entity/init'),
      dispatch('http/init', context),
      dispatch('link-group/init')
    ]);
    commit('apis/setOrigin', state.http.canonicalUrlOrigin);
  }
};
