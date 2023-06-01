// TODO: need _some_ server-side support, so that e.g. private sets don't
//       first load with unauth error then refresh to be auth'd.
//       cookies? make this plugin not just client only? look at keycloak node pkg?
// docs: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
import Keycloak from 'keycloak-js';

const keycloakRefreshAccessToken = async({ $keycloak, $axios, redirect, route }, requestConfig) => {
  const updated = await $keycloak.updateToken(-1);
  if (updated) {
    localStorage.setItem('kc.token', $keycloak.token);
    localStorage.setItem('kc.idToken', $keycloak.idToken);
    localStorage.setItem('kc.refreshToken', $keycloak.refreshToken);
  } else {
    // Refresh token is no longer valid; clear tokens and try again in case it
    // doesn't require auth anyway
    $keycloak.clearToken();
  }

  // Retry request with new access token
  return $axios.request(requestConfig);
};

export const keycloakResponseErrorHandler = (context, error) => {
  if (error.response?.status === 401) {
    return keycloakUnauthorizedResponseErrorHandler(context, error);
  } else {
    return Promise.reject(error);
  }
};

const keycloakUnauthorizedResponseErrorHandler = ({ $axios, $keycloak, redirect, route }, error) => {
  if ($keycloak.refreshToken) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return refreshAccessToken({ $keycloak, $axios, redirect, route }, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return redirect('/account/login', { redirect: route.path });
  }
};

const keycloakAxios = (context, axiosInstance) => {
  axiosInstance.interceptors.request.use((requestConfig) => {
    console.log('keycloak auth req interceptor', context.$keycloak);

    if (context.$keycloak?.token) {
      requestConfig.headers.authorization = `Bearer ${context.$keycloak.token}`;
    }
    return requestConfig;
  });

  if (typeof axiosInstance.onResponseError === 'function') {
    axiosInstance.onResponseError(error => keycloakRefreshAccessToken(context, error));
  }
};

export default async(ctx, inject) => {
  const config = ctx.$config.keycloak;

  const keycloak = new Keycloak(config);

  // keycloak.onTokenExpired = async function() {
  //   console.log('keycloak.onTokenExpired')
  //   const updated = this.updateToken(-1);
  //   if (updated) {
  //     localStorage.setItem('kc.token', keycloak.token);
  //     localStorage.setItem('kc.idToken', keycloak.idToken);
  //     localStorage.setItem('kc.refreshToken', keycloak.refreshToken);
  //   }
  // };

  try {
    await keycloak.init({
      checkLoginIframe: false,
      token: localStorage.getItem('kc.token'),
      idToken: localStorage.getItem('kc.idToken'),
      refreshToken: localStorage.getItem('kc.refreshToken')
    });
  } catch (e) {
    localStorage.removeItem('kc.token');
    localStorage.removeItem('kc.idToken');
    localStorage.removeItem('kc.refreshToken');
    await keycloak.init({
      checkLoginIframe: false
    });
  }

  ctx.store.commit('auth/setLoggedIn', keycloak.authenticated);

  localStorage.setItem('kc.token', keycloak.token);
  localStorage.setItem('kc.idToken', keycloak.idToken);
  localStorage.setItem('kc.refreshToken', keycloak.refreshToken);

  if (keycloak.authenticated) {
    const profile = await keycloak.loadUserProfile();
    ctx.store.commit('auth/setProfile', profile);
    ctx.store.commit('auth/setResourceAccess', keycloak.resourceAccess);
  }

  inject('keycloak', keycloak);
  inject('keycloakAxios', keycloakAxios);
};
