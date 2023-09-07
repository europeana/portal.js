export const actions = {
  // WARNING: Do not make API calls here without **very** good reason, such as
  //          there being no feasible alternative... which is unlikely. Those
  //          requests will be made on **every** SSR, even those interrupted
  //          by middleware, such as those resulting in redirects and never using
  //          the response of the API calls.
  async nuxtServerInit(store, context) {
    // TODO: ideally the contentful module would run this itself...
    store.commit('contentful/setAcceptedMediaTypes', context.req);
    context.$cookies && store.commit('search/setView', context.$cookies.get('searchResultsView'));
  }
};
