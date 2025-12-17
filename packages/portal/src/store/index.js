export const actions = {
  // WARNING: Do not make API calls here without **very** good reason, such as
  //          there being no feasible alternative... which is unlikely. Those
  //          requests will be made on **every** SSR, even those interrupted
  //          by middleware, such as those resulting in redirects and never using
  //          the response of the API calls.
  async nuxtServerInit(store, context) {
    store.commit('apis/init', context);
    context.$cookies && store.commit('search/setView', context.$cookies.get('searchResultsView'));
  }
};
