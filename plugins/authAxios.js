import set from './europeana/set';

export default ({ $axios, $auth, store, redirect }, inject) => {
  const token = $auth.getToken('keycloak');

  const headers = {};
  if (token) headers['Authorization'] = token;
  const redirectUrl = $auth.options.redirect.login;

  const axiosInstance = $axios.create({ headers });

  // Interceptor for user not logged in but token still valid for sets api
  // axiosInstance.onRequest(config => {
  //   if (!$auth.loggedIn) {
  //     redirect(redirectUrl);
  //   }
  //   return config;
  // });

  axiosInstance.onError(error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return redirect(redirectUrl);
    }
  });

  const setWithAxios = set(axiosInstance);

  inject('sets', setWithAxios);

  if ($auth.loggedIn) {
    store.dispatch('set/setLikes');
  }
};
