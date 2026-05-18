// Implements authentication for nuxt using OIDC Authorization Code Flow,
// tailored for Keycloak auth services.

import axios from 'axios';
import { nanoid } from 'nanoid';
import { extractLocaleFromRoutePath } from '@/i18n/routes.js';
import { reactive } from 'vue';

const PLUGIN_NAME = 'auth';
const NUXT_STATE_KEY = `$${PLUGIN_NAME}`;

class Token {
  static ID = '';
  #value = undefined;
  storage;

  static get id() {
    return `${this.ID}_token`;
  }

  constructor({ storage }) {
    this.storage = storage;
    this.load();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.save();
  }

  clear() {
    this.#value = undefined;
    this.save();
  }

  save() {
    if (this.value === undefined) {
      this.storage?.remove(this.constructor.id);
    } else {
      // TODO: consider & test expiration of the cookies
      this.storage?.set(this.constructor.id, this.value);
    }
  }

  load() {
    this.value = this.storage?.get(this.constructor.id);
  }
}
class AccessToken extends Token {
  static ID = 'access';
}
class RefreshToken extends Token {
  static ID = 'refresh';
}

class Config {
  clientId;
  scope;
  origin;
  realm;
  baseURL;
  callbackPaths = {};

  // TODO: set defaults
  constructor({ clientId, scope, origin, realm } = {}) {
    this.clientId = clientId;
    this.scope = scope.join(' ');
    this.origin = origin;
    this.realm = realm;

    this.baseURL = `${this.origin}/auth/realms/${this.realm}/protocol/openid-connect`;

    // TODO: make configurable via plugin config
    this.callbackPaths = {
      login: '/auth/logincb',
      logout: '/auth/logoutcb'
    };
  }
}

const createStorage = ({ cookies }) => {
  const storageKey = (key) => `${PLUGIN_NAME}.${key}`;

  return {
    // TODO: client-side only?
    local: {
      get: (key) => localStorage.getItem(storageKey(key)),
      set: (key, value) => localStorage.setItem(storageKey(key), value),
      remove: (key) => localStorage.removeItem(storageKey(key))
    },
    cookies: {
      get: (key) => cookies.get(storageKey(key)),
      set: (key, value) => cookies.set(storageKey(key), value),
      // TODO: does this do anything server-side?
      remove: (key) => cookies.remove(storageKey(key))
    }
  };
};

const createTokens = ({ storage }) => {
  return {
    access: new AccessToken({ storage }),
    refresh: new RefreshToken({ storage })
  };
};

// @see https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
const createTokenRequestConfig = ({ url, code, clientId, redirectUri }) => ({
  url,
  method: 'post',
  data: new URLSearchParams({
    code,
    'response_type': 'code',
    'client_id': clientId,
    'grant_type': 'authorization_code',
    'redirect_uri': redirectUri
  }),
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
const createUserInfoRequestConfig = ({ url, clientId }) => ({
  url,
  method: 'get',
  params: {
    'client_id': clientId
  }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken
const createRefreshRequestConfig = ({ url, clientId, refreshToken, scope }) => ({
  url,
  method: 'post',
  data: new URLSearchParams({
    'client_id': clientId,
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken,
    scope
  }),
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
});

const createLoginParams = ({ clientId, redirectUri, scope, uiLocales }) => ({
  protocol: 'oauth2',
  'response_type': 'code',
  'access_type': 'online',
  'client_id': clientId,
  'redirect_uri': redirectUri,
  scope,
  state: nanoid(),
  'ui_locales': uiLocales
});

export const createAuthPlugin = ({ options, appBaseURL, route, router, localePath, locale, cookies }) => {
  const config = new Config(options);

  const appUrl = (path) => `${appBaseURL}${path}`;

  const storage = createStorage({ cookies });
  const tokens = createTokens({ storage: storage.cookies });

  const interceptors = {
    request: {
      setAuthorizationHeader: (requestConfig) => {
        requestConfig.headers.authorization = `Bearer ${tokens.access.value}`;
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

  request.withAuth = (requestConfig, axiosInstance = axiosInstanceWithAuth) => {
    return request(requestConfig, axiosInstance);
  };

  const updateTokensFromResponse = (response) => {
    tokens.access.value = response.data[AccessToken.id];
    tokens.refresh.value = response.data[RefreshToken.id];
  };

  const refreshAccessToken = async() => {
    const refreshAccessTokenResponse = await request(createRefreshRequestConfig({
      url: '/token',
      clientId: config.clientId,
      refreshToken: tokens.refresh.value,
      scope: config.scope
    }));
    updateTokensFromResponse(refreshAccessTokenResponse);
  };

  // @see https://www.rfc-editor.org/rfc/rfc6749.html#section-5.2
  const errorResponseIsInvalidGrant = (errorResponse) => {
    return (errorResponse?.status === 400) && (errorResponse?.data?.error === 'invalid_grant');
  };

  const handleUnauthorizedError = async(error) => {
    const requestConfig = error.config;

    if (tokens.refresh.value) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired: get a new access token
      try {
        await refreshAccessToken();
        return request.withAuth(requestConfig);
      } catch (err) {
        if (errorResponseIsInvalidGrant(err.response)) {
          // Refresh token is no longer valid; clear it and try again
          // in case request does not need authorization anyway
          delete requestConfig.headers['authorization'];
          tokens.access.clear();
          tokens.refresh.clear();
          user.info = null;
          const response = await request(requestConfig);
          return response;
        } else {
          // some other error: throw for caller to handle
          throw err;
        }
      }
    } else {
      // User has not already logged in, or we have no refresh token:
      // throw error for caller to handle
      throw error;
    }
  };

  const accountUrl = () => {
    const authAccountUrl = new URL(
      `/auth/realms/${config.realm}/account`, config.origin
    );
    authAccountUrl.search = new URLSearchParams({
      referrer: config.clientId,
      'referrer_uri': appUrl(route.fullPath)
    }).toString();
    return authAccountUrl.toString();
  };

  const goToAuthEndpoint = (endpoint, { params = {} } = {}) => {
    const url = new URL(`${config.baseURL}/${endpoint}`);
    url.search = new URLSearchParams(params);

    // TODO: use vue router? (but it's not a vue route...)
    // TODO: is replace needed at any point in the flow?
    window.location = url;
  };

  const redirectUri = (action, destination) => {
    const url = new URL(appUrl(localePath(config.callbackPaths[action])));
    if (destination) {
      url.search = new URLSearchParams({
        redirect: destination
      });
    }
    return url.toString();
  };

  function login(destination) {
    const params = createLoginParams({
      clientId: config.clientId,
      redirectUri: redirectUri('login', destination || route.fullPath),
      scope: config.scope,
      uiLocales: locale
    });

    storage.local.set('state', params.state);
    storage.local.set('redirect_uri', params.redirect_uri);

    goToAuthEndpoint('auth', { params });
  }

  login.callback = async function() {
    if (user.loggedIn) {
      router.replace(route.query.redirect || '/');
      return;
    }

    const routeQueryState = route.query.state;
    const storedState = storage.local.get('state');

    storage.local.remove('state');

    if (!routeQueryState || !storedState || (routeQueryState !== storedState)) {
      // TODO: use http-errors
      // TODO: handle this in the logincb.vue page
      throw new Error('Unauthorised');
    }

    const tokenRequestConfig = createTokenRequestConfig({
      url: '/token',
      code: route.query.code,
      clientId: config.clientId,
      redirectUri: storage.local.get('redirect_uri')
    });
    storage.local.remove('redirect_uri');
    const tokenResponse = await request(tokenRequestConfig);

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    updateTokensFromResponse(tokenResponse);

    await user.fetch();

    router.replace(route.query?.redirect || '/');
  };

  function logout(destination) {
    const params = {
      'redirect_uri': redirectUri('logout', destination || route.fullPath),
      'ui_locales': locale
    };

    goToAuthEndpoint('logout', { params });
  }

  logout.callback = function() {
    tokens.access.clear();
    tokens.refresh.clear();
    // FIXME: shouldn't need to do this as it shouldn't yet be set...
    user.info = null;

    router.replace(route.query.redirect || '/');
  };

  const fetchUserInfo = async() => {
    let userInfo;

    try {
      const response = await request.withAuth(createUserInfoRequestConfig({
        url: '/userinfo',
        clientId: config.clientId
      }));
      userInfo = response.data;
    } catch (err) {
      if (err.response?.status) {
        // if by this point there is any kind of response error, then either
        // user is no longer logged in and refresh token is expired, or something
        // else is wrong, e.g. the server is down. give up. user is not logged in.
        // tokens should have been cleared. let the caller detect & handle that.
        return null;
      } else {
        throw err;
      }
    }

    return userInfo;
  };

  const user = reactive({
    info: null,
    get loggedIn() {
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
    options: ctx.$config.auth,
    appBaseURL: ctx.$config.app.baseUrl,
    route: ctx.route,
    router: ctx.app.router,
    localePath: ctx.localePath,
    locale: ctx.i18n.locale,
    cookies: ctx.$cookies
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
        nuxtState[NUXT_STATE_KEY] ||= {};
        nuxtState[NUXT_STATE_KEY].user = plugin.user.info;
      });
    }
  };

  await initUserInfo();

  inject(PLUGIN_NAME, plugin);
};
