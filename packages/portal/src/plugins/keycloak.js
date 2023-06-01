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

const keycloakResponseErrorHandler = (context, error) => {
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

const keycloakAxios = (context) => (axiosInstance) => {
  axiosInstance.interceptors.request.use((requestConfig) => {
    if (context.$keycloak.auth?.token) {
      requestConfig.headers.authorization = `Bearer ${context.$keycloak.auth.token}`;
    }
    return requestConfig;
  });

  if (typeof axiosInstance.onResponseError === 'function') {
    axiosInstance.onResponseError(error => keycloakRefreshAccessToken(context, error));
  }
};

const keycloakAuth = async(ctx) => {
  const keycloak = new Keycloak(ctx.$config.keycloak);

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

  ctx.store.commit('keycloak/setLoggedIn', keycloak.authenticated);

  localStorage.setItem('kc.token', keycloak.token);
  localStorage.setItem('kc.idToken', keycloak.idToken);
  localStorage.setItem('kc.refreshToken', keycloak.refreshToken);

  if (keycloak.authenticated) {
    const profile = await keycloak.loadUserProfile();
    ctx.store.commit('keycloak/setProfile', profile);
    ctx.store.commit('keycloak/setResourceAccess', keycloak.resourceAccess);
  }

  return keycloak;
};

const storeModule = {
  namespaced: true,

  state: () => ({
    loggedIn: false,
    profile: {},
    resourceAccess: {}
  }),

  mutations: {
    setLoggedIn(state, value) {
      state.loggedIn = value;
    },

    setProfile(state, value) {
      state.profile = value;
    },

    setResourceAccess(state, value) {
      state.resourceAccess = value;
    }
  },

  getters: {
    userHasClientRole: (state) => (client, role) => {
      return state.resourceAccess[client]?.roles?.includes(role);
    }
  }
};

export default async(ctx, inject) => {
  ctx.store.registerModule('keycloak', storeModule);

  // TODO: need _some_ server-side support, so that e.g. private sets don't
  //       first load with unauth error then refresh to be auth'd.
  //       cookies? make this plugin not just client only? look at keycloak node pkg?
  if (process.client) {
    // TODO: add fn's from keycloak mixin as properties
    inject('keycloak', {
      auth: await keycloakAuth(ctx),
      axios: keycloakAxios(ctx)
    });
  }
};
