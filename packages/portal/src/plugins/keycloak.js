// TODO: move to new workspace pkg?

// docs: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
import Keycloak from 'keycloak-js';

const keycloakAxios = (ctx) => (axiosInstance) => {
  axiosInstance.interceptors.request.use((requestConfig) => {
    if (ctx.$keycloak.auth?.token) {
      requestConfig.headers.authorization = `Bearer ${ctx.$keycloak.auth.token}`;
    }
    return requestConfig;
  });

  if (typeof axiosInstance.onResponseError === 'function') {
    axiosInstance.onResponseError(error => keycloakResponseErrorHandler(ctx, error));
  }
};

const keycloakResponseErrorHandler = (ctx, error) => {
  if (error.response?.status === 401) {
    return keycloakUnauthorizedResponseErrorHandler(ctx, error);
  } else {
    return Promise.reject(error);
  }
};

const keycloakUnauthorizedResponseErrorHandler = ({ $axios, $keycloak, redirect, route }, error) => {
  if ($keycloak.auth.refreshToken) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return keycloakRefreshAccessToken({ $keycloak, $axios, redirect, route }, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return redirect('/account/login', { redirect: route.path });
  }
};

const keycloakRefreshAccessToken = async({ $keycloak, $cookies, $axios }, requestConfig) => {
  const updated = await $keycloak.auth.updateToken(-1);
  if (updated) {
    $cookies.set('kc.token', $keycloak.auth.token);
    $cookies.set('kc.idToken', $keycloak.auth.idToken);
    $cookies.set('kc.refreshToken', $keycloak.auth.refreshToken);
  } else {
    // Refresh token is no longer valid; clear tokens and try again in case it
    // doesn't require auth anyway
    $keycloak.auth.clearToken();
  }

  // Retry request with new access token
  return $axios.request(requestConfig);
};

const keycloakAuth = async(ctx) => {
  const keycloak = new Keycloak(ctx.$config.keycloak);

  try {
    await keycloak.init({
      checkLoginIframe: false,
      token: ctx.$cookies.get('kc.token'),
      idToken: ctx.$cookies.get('kc.idToken'),
      refreshToken: ctx.$cookies.get('kc.refreshToken')
    });
  } catch (e) {
    ctx.$cookies.remove('kc.token');
    ctx.$cookies.remove('kc.idToken');
    ctx.$cookies.remove('kc.refreshToken');
    await keycloak.init({
      checkLoginIframe: false
    });
  }

  ctx.store.commit('keycloak/setLoggedIn', keycloak.authenticated);

  ctx.$cookies.set('kc.token', keycloak.token);
  ctx.$cookies.set('kc.idToken', keycloak.idToken);
  ctx.$cookies.set('kc.refreshToken', keycloak.refreshToken);

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
  ctx.store.commit('keycloak/setLoggedIn', !!ctx.$cookies.get('kc.token'));

  if (process.client) {
    // TODO: add fn's from keycloak mixin as properties
    inject('keycloak', {
      auth: await keycloakAuth(ctx),
      axios: keycloakAxios(ctx)
    });
  }
};
