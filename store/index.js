export const actions = {
  async nuxtServerInit({ dispatch, commit, getters }, context) {
    await Promise.all([
      dispatch('entity/init'),
      dispatch('http/init', context),
      dispatch('link-group/init')
    ]);

    // TODO: does this warrant a store module, or should we just write to context.app here?
    commit('apis/setOrigin', getters['http/origin']);
  }
};
