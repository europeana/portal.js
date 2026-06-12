// Implements authentication for nuxt using OIDC Authorization Code Flow,
// tailored for Keycloak auth services.

import axios from 'axios';
import { nanoid } from 'nanoid';
import { extractLocaleFromRoutePath } from '@/i18n/routes.js';
import { computed, reactive, ref } from 'vue';

import { PLUGIN_NAME, NUXT_STATE_KEY } from './constants.js';
import { createStorage } from './storage.js';
import { createTokens } from './token.js';
import { createUserInfoRequestConfig } from './requests.js';
import { EuropeanaAuthService } from './service.js';

const createConfig = ({ clientId, scope, origin, realm }) => ({
  clientId,
  scope: scope.join(' '),
  origin,
  realm,
  baseURL: `${origin}/auth/realms/${realm}/protocol/openid-connect`,
  // TODO: make configurable via plugin config?
  callbackPaths: {
    login: '/auth/logincb',
    logout: '/auth/logoutcb'
  }
});

const createLoginParams = ({ clientId, redirectUri, scope, uiLocales }) => ({
  'access_type': 'online',
  'client_id': clientId,
  protocol: 'oauth2',
  'redirect_uri': redirectUri,
  'response_type': 'code',
  scope,
  state: nanoid(),
  'ui_locales': uiLocales
});

export const createAuthPlugin = (options = {}) => {
  const { appBaseURL, redirect, route, router, localePath, locale } = options;
  const config = createConfig(options.config);
  const storage = createStorage({ cookies: options.cookies });
  const tokens = createTokens({ storage: storage.cookies });

  const service = new EuropeanaAuthService({ baseURL: config.baseURL });

  const routeRef = ref(route);

  router.beforeEach((to, from, next) => {
    routeRef.value = to;

    if (to.meta?.auth && !user.loggedIn) {
      redirect(login.route.value);
      return;
    }

    next();
  });

  const appUrl = (path) => `${appBaseURL}${path}`;

  const interceptors = {
    request: {
      setAuthorizationHeader: (requestConfig) => {
        if (tokens.access.value) {
          requestConfig.headers.authorization = `Bearer ${tokens.access.value}`;
        }
        return requestConfig;
      }
    },
    response: {
      handleError: (err) => new Promise((resolve, reject) => {
        if (err.response?.status === 401) {
          handleUnauthorizedError(err)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        } else {
          reject(err);
        }
      })
    }
  };

  const axiosInstanceWithoutAuth = axios.create({ baseURL: config.baseURL });

  const axiosInstanceWithAuth = axios.create({ baseURL: config.baseURL });
  axiosInstanceWithAuth.interceptors.request.use(
    (requestConfig) => interceptors.request.setAuthorizationHeader(requestConfig)
  );
  axiosInstanceWithAuth.interceptors.response.use(
    (response) => response,
    (error) => interceptors.response.handleError(error)
  );

  const request = (requestConfig, axiosInstance = axiosInstanceWithoutAuth) => {
    return axiosInstance.request(requestConfig);
  };

  const withAuth = (config, cb) => {
    const configWithAuth = interceptors.request.setAuthorizationHeader(config);

    try {
      return cb(configWithAuth);
    } catch (e) {
      return interceptors.response.handleError(e);
    }
  };

  withAuth(config, service.getUserinfo);

  request.withAuth = (requestConfig, axiosInstance = axiosInstanceWithAuth) => {
    return request(requestConfig, axiosInstance);
  };

  // @see https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken
  const refreshAccessToken = async() => {
    tokens.access.clear();
    const refreshAccessTokenResponse = await service.createToken({ data: {
      'client_id': config.clientId,
      'grant_type': 'refresh_token',
      'refresh_token': tokens.refresh.value,
      scope: config.scope
    } });
    tokens.setFromResponse(refreshAccessTokenResponse);
  };

  // @see https://www.rfc-editor.org/rfc/rfc6749.html#section-5.2
  const errorResponseIsInvalidGrant = (errorResponse) => {
    return (errorResponse?.status === 400) && (errorResponse?.data?.error === 'invalid_grant');
  };

  const handleUnauthorizedError = async(unauthorizedError) => {
    const requestConfig = unauthorizedError.config;

    if (!tokens.refresh.value) {
      // User has not already logged in, or we have no refresh token:
      // throw error for caller to handle
      throw unauthorizedError;
    }

    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired: get a new access token
    try {
      await refreshAccessToken();
      return request.withAuth(requestConfig);
    } catch (refreshError) {
      if (!errorResponseIsInvalidGrant(refreshError.response)) {
        // Failed to refresh access token, but not due to refresh token
        // having expired: throw for caller to handle
        throw refreshError;
      }

      // refresh token is no longer valid; user is no longer logged in
      tokens.clear();
      user.info = null;

      // if it is known to require auth via use of auth middleware,
      // re-route to login page
      if (routeRef.value.meta?.auth) {
        router.push(login.route.value);
        return;
      }

      // otherwise, try the request again in case it does not need
      // token-based authorization anyway
      // if it fails again, the error will need to be caught and handled
      // by caller.
      // TODO: or if this is an SSR, should we send error code in response?
      delete requestConfig.headers['authorization'];
      const response = await request(requestConfig);
      return response;
    }
  };

  const accountUrl = () => {
    const authAccountUrl = new URL(
      `/auth/realms/${config.realm}/account`, config.origin
    );
    authAccountUrl.search = new URLSearchParams({
      referrer: config.clientId,
      'referrer_uri': appUrl(route.fullPath)
    });
    return authAccountUrl.toString();
  };

  // generates the URI on the app to redirect back to after visiting
  // auth/logout endpoints on the auth service. this will be a callback
  // path, with a subsequent local redirect after the callback succeeds.
  const redirectUri = (action, destination) => {
    const url = new URL(appUrl(localePath(config.callbackPaths[action])));
    if (destination) {
      url.search = new URLSearchParams({
        redirect: destination
      });
    }
    return url.toString();
  };

  const createAuthServiceRedirectAction = (endpoint, paramsGenerator, cb) => (destination) => {
    if (process.server) {
      // client-side only due to reliance on localStorage for OIDC state mgmt
      throw new Error('Auth service redirect action is client-side only');
    }

    if (!destination) {
      destination = route.query?.redirect || localePath('/');
    }

    const params = paramsGenerator?.(destination) || {};
    cb?.(params);

    const url = new URL(`${config.baseURL}/${endpoint}`);
    url.search = new URLSearchParams(params);

    window.location.replace(url);
  };

  const createAuthServiceRedirectCallback = (impl) => async(cb) => {
    await impl();
    await cb?.();

    const path = route.query?.redirect || '/';
    router.replace(path);
  };

  const login = createAuthServiceRedirectAction('auth',
    (destination) => (createLoginParams({
      clientId: config.clientId,
      redirectUri: redirectUri('login', destination || route.value.query.redirect),
      scope: config.scope,
      uiLocales: locale
    })),
    (params) => {
      // used for state validation in the login callback
      storage.local.set('state', params.state);
      // used for token creation in the login callback
      storage.local.set('redirect_uri', params.redirect_uri);
    }
  );

  const validateLoginState = () => {
    const routeQueryState = route.query.state;
    const storedState = storage.local.get('state');

    if (!routeQueryState || !storedState || (routeQueryState !== storedState)) {
      // TODO: use http-errors
      // TODO: handle this in the logincb.vue page
      throw new Error('Unauthorised');
    }
  };

  const fetchToken = () => {
    // TODO: handle error response invalid_grant, when code is invalid
    // @see https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
    return service.createToken({ data: {
      'client_id': config.clientId,
      code: route.query.code,
      'grant_type': 'authorization_code',
      'redirect_uri': storage.local.get('redirect_uri'),
      'response_type': 'code'
    } });
  };

  login.callback = createAuthServiceRedirectCallback(async() => {
    validateLoginState();

    const tokenResponse = await fetchToken();

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    tokens.setFromResponse(tokenResponse);

    storage.local.remove('state');
    storage.local.remove('redirect_uri');

    // fetch the userinfo already as otherwise the user is not considered logged-in
    await user.fetch();
  });

  const loginRedirectPath = computed(() => {
    // TODO: this should be derived, from auth path config
    if (routeRef.value.name.startsWith('auth')) {
      return localePath('/');
    }
    return routeRef.value.fullPath;
  });

  login.route = computed(() => {
    return {
      path: localePath('/auth/login'),
      query: { redirect: loginRedirectPath.value }
    };
  });

  const logout = createAuthServiceRedirectAction('logout',
    (destination) => ({
      'redirect_uri': redirectUri('logout', destination || route.value.query.redirect),
      'ui_locales': locale
    })
  );

  logout.callback = createAuthServiceRedirectCallback(() => {
    tokens.clear();
  });

  // TODO: refactor so that each page can register its own logout redirect path
  //       (if needed)
  const logoutRedirectPath = computed(() => {
    if (routeRef.value.meta?.auth) {
      return localePath('/');
    } else if (routeRef.value.name.startsWith('item-all')) {
      if (routeRef.value.query.lang) {
        // rm lang from query
        const query = new URLSearchParams(routeRef.value.query);
        query.delete('lang');
        return `${routeRef.value.path}?${query.toString()}`;
      }
    }
    return routeRef.value.fullPath;
  });

  logout.route = computed(() => {
    return {
      path: localePath('/auth/logout'),
      query: { redirect: logoutRedirectPath.value }
    };
  });

  const fetchUserInfo = async() => {
    let userInfo = null;

    try {
      const response = await service.getUserinfo({ params: { 'client_id': config.clientId } })
      const response = await request.withAuth(createUserInfoRequestConfig({
        clientId: config.clientId
      }));
      userInfo = response.data;
    } catch (fetchUserInfoError) {
      if (fetchUserInfoError.response?.status === 401) {
        // user is not logged-in (any more), let return result in userInfo
        // being reset to null, reflecting this
      } else {
        throw fetchUserInfoError;
      }
    }

    return userInfo;
  };

  const user = reactive({
    info: null,
    get loggedIn() {
      // TODO: should we rely on presence (hence retrieval) of userinfo to
      //       determine logged-in state? costs a request, but does validate
      //       tokens, so perhaps.
      // TODO: if not logged in, ensure client-side localStorage and cookies for auth
      //       get cleared after page load
      return !!this.info;
    },
    hasClientRole(client, role) {
      return this.info?.resource_access?.[client]?.roles?.includes(role) || false;
    },
    async fetch() {
      this.info = await fetchUserInfo();
    }
  });

  return {
    accountUrl,
    config,
    interceptors,
    login,
    logout,
    request,
    tokens,
    user
  };
};

export default async(ctx, inject) => {
  const plugin = createAuthPlugin({
    config: ctx.$config.auth,
    appBaseURL: ctx.$config.app.baseUrl,
    beforeSerialize: ctx.beforeSerialize,
    nuxtState: ctx.nuxtState,
    redirect: ctx.redirect,
    route: ctx.route,
    router: ctx.app.router,
    localePath: ctx.localePath,
    locale: ctx.i18n.locale,
    cookies: ctx.$cookies
  });

  // initialise nuxt state on SSR to hydrate front-end w/ shared data
  ctx.beforeSerialize?.((nuxtState) => {
    nuxtState[NUXT_STATE_KEY] ||= {};
    nuxtState[NUXT_STATE_KEY].user = plugin.user.info;
  });

  const initUserInfo = async() => {
    // TODO: make use of i18n optional
    const { path: localelessPath } = extractLocaleFromRoutePath(ctx.route.path);

    // do not init user info on login/logout callback paths
    if (Object.values(plugin.config.callbackPaths).includes(localelessPath)) {
      return;
    }

    if (plugin.tokens.access.value && !plugin.user.loggedIn) {
      if (ctx.nuxtState?.[NUXT_STATE_KEY]?.user) {
        plugin.user.info = ctx.nuxtState[NUXT_STATE_KEY].user;
      } else {
        await plugin.user.fetch();
      }

      // store it in the nuxt state for hydration to prevent re-calling user.fetch client-side
      ctx.beforeSerialize?.((nuxtState) => {
        // TODO: is this redundant given previous setting of nuxtState[NUXT_STATE_KEY].user?
        nuxtState[NUXT_STATE_KEY].user = plugin.user.info;
      });
    }
  };

  await initUserInfo();

  inject(PLUGIN_NAME, plugin);
};
