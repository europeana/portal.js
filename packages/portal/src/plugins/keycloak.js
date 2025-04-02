// TODO: move to new workspace pkg?
// TODO: rm dependency on nuxt cookies module

// docs: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
import Keycloak from 'keycloak-js';

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

const plugin = (ctx) => ({
  // TODO: use this.keycloak.createLoginUrl instead
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
  addAxiosInterceptors(axiosInstance) {
    axiosInstance.interceptors.request.use((requestConfig) => {
      if (this.keycloak?.token) {
        requestConfig.headers.authorization = `Bearer ${this.keycloak.token}`;
      }
      return requestConfig;
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleResponseError(axiosInstance, error);
      }
    );

    return axiosInstance;
  },
  callback() {
    let redirect = '/';

    if (ctx.route.query.redirect?.startsWith('/')) {
      redirect = ctx.route.query.redirect;
    }

    ctx.app.router.replace(redirect);
  },
  async init() {
    if (!process.client) {
      return;
    }

    try {
      await this.keycloak.init({
        checkLoginIframe: false,
        token: ctx.$cookies.get('kc.token'),
        idToken: ctx.$cookies.get('kc.idToken'),
        refreshToken: ctx.$cookies.get('kc.refreshToken')
      });
    } catch (e) {
      ctx.$cookies.remove('kc.token');
      ctx.$cookies.remove('kc.idToken');
      ctx.$cookies.remove('kc.refreshToken');
      await this.keycloak.init({
        checkLoginIframe: false
      });
    }

    ctx.store.commit('keycloak/setLoggedIn', this.keycloak.authenticated);

    ctx.$cookies.set('kc.token', this.keycloak.token);
    ctx.$cookies.set('kc.idToken', this.keycloak.idToken);
    ctx.$cookies.set('kc.refreshToken', this.keycloak.refreshToken);

    if (this.keycloak.authenticated) {
      const profile = await this.keycloak.loadUserProfile();
      ctx.store.commit('keycloak/setProfile', profile);
      ctx.store.commit('keycloak/setResourceAccess', this.keycloak.resourceAccess);
    }
  },
  keycloak: process.client && new Keycloak(ctx.$config.keycloak),
  login() {
    this.keycloak.login({
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
    this.keycloak.logout({
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
  },
  handleResponseError(axiosInstance, error) {
    if (error.response?.status === 401) {
      return this.handleUnauthorizedResponseError(axiosInstance, error);
    } else {
      return Promise.reject(error);
    }
  },
  handleUnauthorizedResponseError(axiosInstance, error) {
    if (this.keycloak.refreshToken) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired
      return this.refreshAccessToken(axiosInstance, error.config);
    } else {
      // User has not already logged in, or we have no refresh token:
      // redirect to OIDC login URL
      return ctx.redirect('/account/login', { redirect: ctx.route.path });
    }
  },
  async refreshAccessToken(axiosInstance, requestConfig) {
    const updated = await this.keycloak.updateToken(-1);
    if (updated) {
      ctx.$cookies.set('kc.token', this.keycloak.token);
      ctx.$cookies.set('kc.idToken', this.keycloak.idToken);
      ctx.$cookies.set('kc.refreshToken', this.keycloak.refreshToken);
    } else {
      // Refresh token is no longer valid; clear tokens and try again in case it
      // doesn't require auth anyway
      this.keycloak.clearToken();
    }


    // Retry request with new access token
    // QUESTION: does this retain any interceptors?
    return axiosInstance.request(requestConfig);
  }
});

export default async(ctx, inject) => {
  ctx.store.registerModule('keycloak', storeModule);

  ctx.store.commit('keycloak/setLoggedIn', !!ctx.$cookies.get('kc.token'));

  const contextualPlugin = plugin(ctx);
  await contextualPlugin.init();

  inject('keycloak', contextualPlugin);
};
