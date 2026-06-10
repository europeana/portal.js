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
    clear() {
      this.access.clear();
      this.refresh.clear();
    },
    refresh: new RefreshToken({ storage }),
    setFromResponse(response) {
      this.access.value = response.data[AccessToken.id];
      this.refresh.value = response.data[RefreshToken.id];
    }
  };
};

// @see https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
const createTokenRequestConfig = ({ code, clientId, redirectUri }) => ({
  url: '/token',
  method: 'post',
  data: new URLSearchParams({
    'client_id': clientId,
    code,
    'grant_type': 'authorization_code',
    'redirect_uri': redirectUri,
    'response_type': 'code'
  }),
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
const createUserInfoRequestConfig = ({ clientId }) => ({
  url: '/userinfo',
  method: 'get',
  params: {
    'client_id': clientId
  }
});

// @see https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken
const createRefreshRequestConfig = ({ clientId, refreshToken, scope }) => ({
  url: '/token',
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
  'access_type': 'online',
  'client_id': clientId,
  protocol: 'oauth2',
  'redirect_uri': redirectUri,
  'response_type': 'code',
  scope,
  state: nanoid(),
  'ui_locales': uiLocales
});

export const createAuthPlugin = ({ options, appBaseURL, route, router, localePath, locale, cookies }) => {
  const config = createConfig(options);
  const storage = createStorage({ cookies });
  const tokens = createTokens({ storage: storage.cookies });

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

  request.withAuth = (requestConfig, axiosInstance = axiosInstanceWithAuth) => {
    return request(requestConfig, axiosInstance);
  };

  const refreshAccessToken = async() => {
    tokens.access.clear();
    const refreshAccessTokenResponse = await request(createRefreshRequestConfig({
      clientId: config.clientId,
      refreshToken: tokens.refresh.value,
      scope: config.scope
    }));
    tokens.setFromResponse(refreshAccessTokenResponse);
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
          tokens.clear();
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
    const params = paramsGenerator?.(destination) || {};
    cb?.(params);

    const url = new URL(`${config.baseURL}/${endpoint}`);
    url.search = new URLSearchParams(params);

    // TODO: use vue router? (but it's not a vue route...)
    // TODO: is replace needed at any point in the flow?
    window.location = url;
  };

  const createAuthServiceRedirectCallback = (impl) => async(cb) => {
    await impl();

    await cb?.();

    router.replace(route.query?.redirect || '/');
  };

  const login = createAuthServiceRedirectAction('auth',
    (destination) => (createLoginParams({
      clientId: config.clientId,
      redirectUri: redirectUri('login', destination || route.fullPath),
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
    return request(createTokenRequestConfig({
      code: route.query.code,
      clientId: config.clientId,
      redirectUri: storage.local.get('redirect_uri')
    }));
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

  const logout = createAuthServiceRedirectAction('logout',
    (destination) => ({
      'redirect_uri': redirectUri('logout', destination || route.fullPath),
      'ui_locales': locale
    })
  );

  logout.callback = createAuthServiceRedirectCallback(() => {
    tokens.clear();
    // FIXME: shouldn't need to do this as it shouldn't yet be set...
    user.info = null;
  });

  const fetchUserInfo = async() => {
    let userInfo = null;

    try {
      const response = await request.withAuth(createUserInfoRequestConfig({
        clientId: config.clientId
      }));
      userInfo = response.data;
    } catch (err) {
      if (err.response?.status) {
        // if by this point there is any kind of response error, then either
        // user is no longer logged in and refresh token is expired, or something
        // else is wrong, e.g. the server is down. give up. user is not logged in.
        // tokens should have been cleared. let the caller detect & handle that.
      } else {
        throw err;
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
