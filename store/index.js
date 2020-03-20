import europeanaPlugin from '../plugins/europeana';

export const actions = {
  async nuxtServerInit(store, context) {
    await Promise.all([
      store.dispatch('entity/init'),
      store.dispatch('http/init', context),
      store.dispatch('link-group/init')
    ]);

    // TODO: does this warrant a store module, or should we just write to context.app here?
    store.commit('apis/setOrigin', store.getters['http/origin']);
    europeanaPlugin({ store });
  }
};
