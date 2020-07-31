import set from './europeana/set';

export default function({ $axios, $auth, redirect }, inject) {
  const token = $auth.getToken('keycloak');
  const redirectUrl = $auth.options.redirect.login;

  const axiosInstance = $axios.create({
    headers: {
      'Authorization': token
    }
  });

  // Interceptor for user not logged in but token still valid for sets api
  axiosInstance.onRequest(config => {
    if (!$auth.loggedIn) {
      redirect(redirectUrl);
    }
    return config;
  });

  axiosInstance.onError(error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return redirect(redirectUrl);
    }
  });

  const setWithAxios = set(axiosInstance);

  inject('galleries', setWithAxios);
}

