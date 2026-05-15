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

// TODO: consider whether everything belongs inside here, esp considering it gets called
//       once on every SSR
export const createAuthPlugin = (ctx) => {
  const config = ctx.$config.auth;
  const scope = config.scope.join(' ');
  const url = `${config.origin}/auth/realms/${config.realm}/protocol/openid-connect`;
  const endpoints = {
    auth: `${url}/auth`,
    logout: `${url}/logout`,
    token: `${url}/token`,
    userinfo: `${url}/userinfo`
  };

  const appUrl = (path) => `${ctx.$config.app.baseUrl}${path}`;
  // TODO: make configurable via plugin options from config
  const callbackPaths = {
    login: '/auth/logincb',
    logout: '/auth/logoutcb'
  };

  const user = reactive({
    info: null,
    get loggedIn() {
      return !!this.info;
    },
    hasClientRole(client, role) {
      return this.info?.resource_access?.[client]?.roles?.includes(role) || false;
    }
  });

  const storageKey = (key) => `${PLUGIN_NAME}.${key}`;
  const storage = {
    // TODO: client-side only?
    local: {
      get: (key) => localStorage.getItem(storageKey(key)),
      set: (key, value) => localStorage.setItem(storageKey(key), value),
      remove: (key) => localStorage.removeItem(storageKey(key))
    },
    cookies: {
      get: (key) => ctx.$cookies.get(storageKey(key)),
      set: (key, value) => ctx.$cookies.set(storageKey(key), value),
      // TODO: does this do anything server-side?
      remove: (key) => ctx.$cookies.remove(storageKey(key))
    }
  };

  const refreshToken = new RefreshToken({ storage: storage.cookies });
  const accessToken = new AccessToken({ storage: storage.cookies });

  // const getAccessToken = () => {
  //   return storage.cookies.get('accessToken');
  // };

  // const removeAccessToken = () => {
  //   return storage.cookies.remove('accessToken');
  // };

  // const getRefreshToken = () => {
  //   return storage.cookies.get('refreshToken');
  // };

  // const setRefreshToken = (value)  => {
  //   return storage.cookies.set('refreshToken', value);
  // };

  // const removeRefreshToken = () => {
  //   return storage.cookies.remove('refreshToken');
  // };

  const axiosInstanceWithoutAuth = axios.create();

  const addAuthorizationHeaderToRequest = (requestConfig) => {
    requestConfig.headers.authorization = `Bearer ${accessToken.value}`;
    return requestConfig;
  };

  const axiosInstanceWithAuth = axios.create();
  axiosInstanceWithAuth.interceptors.request.use(
    (requestConfig) => addAuthorizationHeaderToRequest(requestConfig)
  );
  axiosInstanceWithAuth.interceptors.response.use(
    (response) => response,
    (error) => handleRequestError(error)
  );

  const request = async(requestConfig, axiosInstance = axiosInstanceWithoutAuth) => {
    console.group('request');
    console.log('config.url', requestConfig.url);
    console.log('config.headers', requestConfig.headers);
    const response = await axiosInstance.request(requestConfig);
    if (response) {
      console.log('response is present', requestConfig);
      console.log('response status', response.status);
      console.log('response data', response.data);
    } else {
      console.log('response is empty', requestConfig);
    }
    console.groupEnd();
    return response;
  };

  const requestWithAuth = (requestConfig, axiosInstance = axiosInstanceWithAuth) => {
    return request(requestConfig, axiosInstance);
  };

  const updateTokensFromResponse = (response) => {
    console.group('updateTokensFromResponse');
    // console.log('response', response);
    accessToken.value = response.data[AccessToken.id];
    refreshToken.value = response.data[RefreshToken.id];
    console.log('accessToken.value', accessToken.value);
    console.log('refreshToken.value', refreshToken.value);
    console.groupEnd();
  };

  const refreshAccessToken = async() => {
    console.group('refreshAccessToken');
    try {
      const refreshAccessTokenResponse = await request({
        method: 'post',
        url: endpoints.token,
        data: new URLSearchParams({
          'client_id': config.clientId,
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken.value,
          scope
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('refreshAccessTokenResponse', refreshAccessTokenResponse?.data);
      updateTokensFromResponse(refreshAccessTokenResponse);
    } catch (error) {
      logResponseError(error, 'refreshAccessToken');
      throw error;
    } finally {
      console.groupEnd();
    }
  };

  const logResponseError = (error, group) => {
    console.group(`[${group}] logResponseError`);
    console.error('message', error.message);
    console.error('stack', error.stack);
    error.config?.url && console.error('request.url', error.config?.url);
    error.config?.headers && console.error('request.headers', error.config?.headers);
    error.config?.data && console.error('request.data', error.config?.data);
    error.response?.status && console.error('response.status', error.response?.status);
    error.response?.data && console.error('response.data', error.response?.data);
    console.groupEnd();
  };

  // @see https://www.rfc-editor.org/rfc/rfc6749.html#section-5.2
  const errorResponseIsInvalidGrant = (errorResponse) => {
    return (errorResponse?.status === 400) && (errorResponse?.data?.error === 'invalid_grant');
  };

  const handleUnauthorizedError = async(error) => {
    console.group('handleUnauthorizedError');
    // TODO: should we clear it yet? or wait til later?
    // accessToken.clear();
    console.log('access token', accessToken.value);
    console.log('refresh token', refreshToken.value);
    console.groupEnd();
    // throw error
    const requestConfig = error.config;

    if (refreshToken.value) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired: get a new access token
      try {
        await refreshAccessToken();
        const response = await requestWithAuth(requestConfig);
        console.log('handled unauthorized error', response);
        return response;
      } catch (err) {
        if (errorResponseIsInvalidGrant(err.response)) {
          // Refresh token is no longer valid; clear it and try again
          // in case request does not need authorization anyway
          console.log('refresh token no longer valid');
          delete requestConfig.headers['authorization'];
          accessToken.clear();
          refreshToken.clear();
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
      'referrer_uri': ctx.$config.app.baseUrl
    }).toString();
    return authAccountUrl.toString();
  };

  const goToAuthEndpoint = (endpoint, { params = {} } = {}) => {
    const url = new URL(endpoints[endpoint]);
    url.search = new URLSearchParams(params);

    // TODO: use vue router?
    // TODO: is replace needed at any point in the flow?
    window.location = url;
  };

  const redirectUri = (action, destination) => {
    const url = new URL(appUrl(ctx.localePath(callbackPaths[action])));
    if (destination) {
      url.search = new URLSearchParams({
        redirect: destination
      });
    }
    return url.toString();
  };

  function login(destination) {
    const params = {
      protocol: 'oauth2',
      'response_type': 'code',
      'access_type': 'online',
      'client_id': config.clientId,
      'redirect_uri': redirectUri('login', destination || ctx.route.fullPath),
      scope,
      state: nanoid(),
      'ui_locales': ctx.i18n.locale
    };

    storage.local.set('state', params.state);
    storage.local.set('redirect_uri', params.redirect_uri);

    goToAuthEndpoint('auth', { params });
  }

  login.callback = async function() {
    if (user.loggedIn) {
      ctx.app.router.replace(ctx.route.query.redirect || '/');
    }

    const routeQueryState = ctx.route.query.state;
    const storedState = storage.local.get('state');

    storage.local.remove('state');

    if (!routeQueryState || !storedState || (routeQueryState !== storedState)) {
      // TODO: use http-errors
      // TODO: handle this in the logincb.vue page
      throw new Error('Unauthorised');
    }

    const tokenRequestConfig = {
      url: endpoints.token,
      method: 'post',
      data: new URLSearchParams({
        'code': ctx.route.query.code,
        'response_type': 'code',
        'client_id': config.clientId,
        'grant_type': 'authorization_code',
        'redirect_uri': storage.local.get('redirect_uri')
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };
    storage.local.remove('redirect_uri');
    const tokenResponse = await request(tokenRequestConfig);

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    updateTokensFromResponse(tokenResponse);

    await fetchUserInfo();

    ctx.app.router.replace(ctx.route.query?.redirect || '/');
  };

  function logout(destination) {
    const params = {
      'redirect_uri': redirectUri('logout', destination || ctx.route.fullPath),
      'ui_locales': ctx.i18n.locale
    };

    goToAuthEndpoint('logout', { params });
  }

  logout.callback = function() {
    accessToken.clear();
    refreshToken.clear();
    // FIXME: shouldn't need to do this as it shouldn't yet be set...
    user.info = null;

    ctx.app.router.replace(ctx.route.query.redirect || '/');
  };

  // TODO: should this be named handleResponseError?
  const handleRequestError = async(err) => {
    logResponseError(err, 'handleRequestError');
    return new Promise((resolve, reject) => {
      if (err.response?.status === 401) {
        handleUnauthorizedError(err)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      } else {
        reject(err);
      }
    });
  };

  const fetchUserInfo = async() => {
    let userInfo;

    if (ctx.nuxtState?.[NUXT_STATE_KEY]?.user) {
      userInfo = ctx.nuxtState[NUXT_STATE_KEY].user;
    } else {
      try {
        const response = await requestWithAuth({
          url: endpoints.userinfo,
          method: 'get',
          params: {
            'client_id': config.clientId
          }
        });
        console.log('fetchUserInfo response', response?.data);
        userInfo = response.data;
      } catch (err) {
        console.group('fetchUserInfo error');
        logResponseError(err, 'fetchUserInfo');
        // if by this point there is any kind of response error, then either
        // user is no longer logged in and refresh token is expired, or something
        // else is wrong, e.g. the server is down. give up. user is not logged in.
        // tokens should have been cleared. let the caller handle that.
        if (err.response?.status) {
          console.log('fetchUserInfo failed due to response error');
          console.log('accessToken', accessToken.value);
          console.log('refreshToken', refreshToken.value);
          // console.log('user', user)
        } else {
          throw err;
        }
        console.groupEnd();
      }
    }

    user.info = userInfo;
  };

  const initUserInfo = async() => {
    // TODO: make use of i18n optional
    const { path: localelessPath } = extractLocaleFromRoutePath(ctx.route.path);

    // do not init user info on login/logout callback paths
    if (Object.values(callbackPaths).includes(localelessPath)) {
      return;
    }

    if (accessToken.value && !user.loggedIn && (ctx.route.path !== callbackPaths.logout)) {
      await fetchUserInfo();
      // store it in the nuxt state for hydration to prevent re-calling fetchUserInfo client-side
      ctx.beforeSerialize?.((nuxtState) => {
        nuxtState[NUXT_STATE_KEY] ||= {};
        nuxtState[NUXT_STATE_KEY].user = user.info;
      });
    }
  };

  return {
    get accessToken() {
      return accessToken.value;
    },
    get accountUrl() {
      return accountUrl();
    },
    addAuthorizationHeaderToRequest,
    handleRequestError,
    initUserInfo,
    login,
    logout,
    get refreshToken() {
      return refreshToken.value;
    },
    request,
    requestWithAuth,
    user
  };
};

export default async(ctx, inject) => {
  const plugin = createAuthPlugin(ctx);
  console.group('init auth plugin');
  console.log('accessToken', plugin.accessToken);
  console.log('refreshToken', plugin.refreshToken);
  console.groupEnd();

  await plugin.initUserInfo();

  inject(PLUGIN_NAME, plugin);
};
