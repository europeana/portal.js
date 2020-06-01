import europeanaPlugin from '../plugins/europeana';

export const actions = {
  async nuxtServerInit(store, context) {
    await Promise.all([
      // TODO: restore, replacing with GraphQL query in relevant contexts
      // store.dispatch('entity/init'),
      store.dispatch('http/init', context)
    ]);

    // TODO: does this warrant a store module, or should we just write to context.app here?
    store.commit('apis/setOrigin', store.getters['http/origin']);
    europeanaPlugin({ store });
  }
};
