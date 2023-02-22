export default async({ $auth, store }) => {
  if ($auth?.loggedIn) {
    try {
      // TODO: assess whether there is a more efficient way to do this with fewer
      //       API requests
      await store.dispatch('set/setLikes');
      await store.dispatch('set/fetchLikes');
    } catch(e) {
    }    
  }
};
