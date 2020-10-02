import recommendation from './europeana/recommendation';
import set from './europeana/set';

export default ({ $auth, store, redirect }, inject) => {
  const redirectUrl = $auth.options.redirect.login;
  const axiosInstance = $auth.ctx.app.$axios;

  axiosInstance.onError(error => {
    if (!$auth.loggedIn && error.response && error.response.status === 401) {
      return redirect(redirectUrl);
    }
  });

  // FIXME: should these go into apis store instead? (for customisable config by
  //        HTTP header. perhaps only if/when needed for these APIs)
  inject('sets', set(axiosInstance));
  inject('recommendations', recommendation(axiosInstance));

  if ($auth.loggedIn) {
    store.dispatch('set/setLikes')
      .then(() => store.dispatch('set/fetchLikes'));
  }
};
