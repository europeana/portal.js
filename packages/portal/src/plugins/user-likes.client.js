export default async({ $apis, $auth, store }) => {
  if ($auth?.loggedIn) {
    try {
      const likesId = await $apis.set.getLikes($auth.user ? $auth.user.sub : null);
      store.commit('set/setLikesId', likesId);
    } catch (e) {
      // Don't cause everything to break if the Set API is down...
    }
  }
};
