import recommendation from './europeana/recommendation';
import set from './europeana/set';

export default ({ $axios, $auth, store, redirect }, inject) => {
  const token = $auth.getToken('keycloak');

  const headers = {};
  if (token) headers['Authorization'] = token;
  const redirectUrl = $auth.options.redirect.login;

  const axiosInstance = $axios.create({ headers });

  axiosInstance.onError(error => {
    if (!$auth.loggedIn && error.response && error.response.status === 401) {
      return redirect(redirectUrl);
    }
  });

  inject('sets', set(axiosInstance));
  inject('recommendations', recommendation(axiosInstance));

  if ($auth.loggedIn) {
    store.dispatch('set/setLikes')
      .then(store.dispatch('set/fetchLikes'));
  }
};
