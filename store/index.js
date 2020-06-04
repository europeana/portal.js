import europeanaPlugin from '../plugins/europeana';

export const actions = {
  async nuxtServerInit(store, context) {
    store.dispatch('http/init', context);

    // TODO: does this warrant a store module, or should we just write to context.app here?
    store.commit('apis/setOrigin', store.getters['http/origin']);
    europeanaPlugin({ store });
  }
};
