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

const keycloakUnauthorizedResponseErrorHandler = (ctx, error) => {
  if (ctx.$keycloak.auth.refreshToken) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return keycloakRefreshAccessToken(ctx, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return ctx.redirect('/account/login', { redirect: route.path });
  }
};

const keycloakRefreshAccessToken = async(ctx, requestConfig) => {
  const updated = await ctx.$keycloak.auth.updateToken(-1);
  if (updated) {
    ctx.$cookies.set('kc.token', ctx.$keycloak.auth.token);
    ctx.$cookies.set('kc.idToken', ctx.$keycloak.auth.idToken);
    ctx.$cookies.set('kc.refreshToken', ctx.$keycloak.auth.refreshToken);
  } else {
    // Refresh token is no longer valid; clear tokens and try again in case it
    // doesn't require auth anyway
    ctx.$keycloak.auth.clearToken();
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

const plugin = async(ctx) => ({
  // TODO: use this.auth.createLoginUrl instead
  get accountUrl() {
    const keycloakAccountUrl = new URL(ctx.$config.keycloak.url);

    keycloakAccountUrl.pathname = `${keycloakAccountUrl.pathname}/realms/${ctx.$config.keycloak.realm}/account`;
    if (keycloakAccountUrl.pathname.startsWith('//')) {
      keycloakAccountUrl.pathname = keycloakAccountUrl.pathname.slice(1);
    }

    const referrerUri = new URL(ctx.$config.app.baseUrl);
    referrerUri.pathname = ctx.route.path;
    referrerUri.search = new URLSearchParams(ctx.route.query).toString();
    referrerUri.hash = ctx.route.hash;

    keycloakAccountUrl.search = new URLSearchParams({
      referrer: ctx.$config.keycloak.clientId,
      'referrer_uri': referrerUri.toString()
    }).toString();

    return keycloakAccountUrl.toString();
  },
  auth: process.client && await keycloakAuth(ctx),
  axios: keycloakAxios(ctx),
  callback() {
    let redirect = '/';

    if (ctx.route.query.redirect?.startsWith('/')) {
      redirect = ctx.route.query.redirect;
    }

    ctx.app.router.replace(redirect);
  },
  login() {
    this.auth.login({
      locale: ctx.i18n.locale,
      redirectUri: this.loginRedirect
    });
  },
  get loginRedirect() {
    let redirectPath = ctx.localePath('/account');

    if (ctx.route) {
      if ((ctx.route.query?.redirect || '').startsWith('/')) {
        redirectPath = ctx.route.query.redirect;
      } else if (ctx.route.path === ctx.localePath('/account/login')) {
        redirectPath = ctx.localePath('/account');
      } else {
        redirectPath = ctx.route.fullPath;
      }
    }

    const redirectUrl = new URL(`${ctx.$config.app.baseUrl}${ctx.localePath('/account/callback')}`);
    redirectUrl.searchParams.set('redirect', redirectPath);

    return redirectUrl.toString();
  },
  logout() {
    this.auth.logout({
      redirectUri: this.logoutRedirect,
      'ui_locales': ctx.i18n.locale
    });
  },
  get logoutRedirect() {
    let redirectPath = ctx.localePath('/');

    if ((ctx.route.query?.redirect || '').startsWith('/')) {
      redirectPath = ctx.route.query.redirect;
    } else if (ctx.route.fullPath) {
      redirectPath = ctx.route.fullPath;
    }

    const redirectUrl = new URL(`${ctx.$config.app.baseUrl}${ctx.localePath('/account/callback')}`);
    redirectUrl.searchParams.set('redirect', redirectPath);

    return redirectUrl.toString();
  },
  get logoutRoute() {
    let redirect = '/';
    if (!ctx.route.name.startsWith('account')) {
      redirect = ctx.route.fullPath;
    }
    return {
      name: 'account-logout',
      query: {
        redirect
      }
    };
  }
});

export default async(ctx, inject) => {
  ctx.store.registerModule('keycloak', storeModule);

  ctx.store.commit('keycloak/setLoggedIn', !!ctx.$cookies.get('kc.token'));

  inject('keycloak', await plugin(ctx));
};
