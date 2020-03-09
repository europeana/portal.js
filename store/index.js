export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    await Promise.all([
      dispatch('entity/init'),
      dispatch('http/init', context),
      dispatch('link-group/init')
    ]);

    // TODO: does this warrant a store module, or should we just write to context.app here?
    commit('apis/setOrigin', state.http.canonicalUrlOrigin);
  }
};
