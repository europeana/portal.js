export default async({ $auth, store }) => {
  if ($auth?.loggedIn) {
    await store.dispatch('set/setLikes');
    await store.dispatch('set/fetchLikes');
  }
};
