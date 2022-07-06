export default ({ $auth, store }) => {
  console.log('user-likes');
  if ($auth && $auth.loggedIn) {
    store.dispatch('set/setLikes')
      .then(() => store.dispatch('set/fetchLikes'));
  }
};
