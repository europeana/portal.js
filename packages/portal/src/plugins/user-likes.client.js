export default async({ $apis, $auth, store }) => {
  if ($auth?.loggedIn) {
    try {
      // TODO: assess whether there is a more efficient way to do this with fewer
      //       API requests
      const likesId = await $apis.set.getLikes($auth.user ? $auth.user.sub : null);
      store.commit('set/setLikesId', likesId);
      await store.dispatch('set/fetchLikes');
    } catch (e) {
      // Don't cause everything to break if the Set API is down...
    }
  }
};
