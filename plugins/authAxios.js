import recommendation from './europeana/recommendation';
import set from './europeana/set';

export default ({ $axios, $auth, store, redirect }, inject) => {
  const token = $auth.loggedIn ? $auth.getToken('keycloak') : null;

  const headers = {};
  if (token) headers['Authorization'] = token;
  else delete $axios.defaults.headers.common['Authorization'];
  const redirectUrl = $auth.options.redirect.login;

  const axiosInstance = $axios.create({ headers });

  axiosInstance.onError(error => {
    if (!$auth.loggedIn && error.response && (error.response.status === 401 || error.response.status === 403)) {
      return redirect(redirectUrl);
    } else {
      return Promise.reject(error);
    }
  });

  inject('sets', set(axiosInstance));
  inject('recommendations', recommendation(axiosInstance));

  if ($auth.loggedIn) {
    store.dispatch('set/setLikes');
  }
};
