// TODO: should this be client-only?

import { nanoid } from 'nanoid';

// TODO: or is this largely compatible with any OIDC provider?
const PLUGIN_NAME = 'keycloak';

const updateRefreshToken = ($auth, refreshAccessTokenResponse) => {
  const options = $auth.strategy.options;

  let newRefreshToken = refreshAccessTokenResponse[options.refresh_token_key];
  if (!newRefreshToken) {
    return false;
  }

  if (options.token_type) {
    newRefreshToken = `${options.token_type} ${newRefreshToken}`;
  }

  // Store refresh token
  $auth.setRefreshToken($auth.strategy.name, newRefreshToken);

  return newRefreshToken;
};

// TODO: consider whether everything belongs inside here, esp considering it gets called
//       once on every SSR
export const createKeycloakPlugin = (ctx) => {
  const config = ctx.$config.keycloak;
  // const router = ctx.app.router;
  // console.log('oauth config', config)
  const scope = config.scope.join(' ');
  const url = `${config.origin}/auth/realms/${config.realm}/protocol/openid-connect`;
  const endpoints = {
    auth: `${url}/auth`,
    logout: `${url}/logout`,
    token: `${url}/token`,
    userinfo: `${url}/userinfo`
  };

  const appUrl = (path) => `${ctx.$config.app.baseUrl}${path}`;
  const callbackPaths = {
    login: '/account/logincb',
    logout: '/account/logoutcb'
  };

  let user = null;

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
      remove: (key) => ctx.$cookies.remove(storageKey(key))
    }
  };

  const getRefreshToken = () => {
    return storage.cookies.get('refreshToken');
  };

  const refreshAccessTokenRequestOptions = () => {
    return {
      method: 'post',
      url: endpoints.token,
      data: new URLSearchParams({
        'client_id': config.clientId,
        'refresh_token': getRefreshToken(),
        'grant_type': 'refresh_token'
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
  };

  const updateAccessToken = (requestConfig, refreshAccessTokenResponse) => {
    const newAccessToken = refreshAccessTokenResponse.access_token;
    if (!newAccessToken) {
      return false;
    }

    storage.cookies.set('accessToken', newAccessToken);

    // Set axios token
    // FIXME
    // $auth.strategy._setToken(newAccessToken); // eslint-disable-line no-underscore-dangle

    delete requestConfig.headers['Authorization'];
    delete requestConfig.headers['authorization'];
    // TODO: use axios instead of $axios, and set new Authorization header here
    //       from newAccessToken?

    return newAccessToken;
  };

  const refreshAccessToken = async(requestConfig) => {
    let refreshAccessTokenResponse;
    try {
      refreshAccessTokenResponse = await ctx.$axios.request(refreshAccessTokenRequestOptions());
    } catch {
      // Refresh token is no longer valid; clear tokens and try again
      storage.cookies.remove('accessToken');
      storage.cookies.remove('refreshToken');
      delete requestConfig.headers['Authorization'];
      delete requestConfig.headers['authorization'];
      return ctx.$axios.request(requestConfig);
    }

    if (!updateAccessToken(requestConfig, refreshAccessTokenResponse)) {
      // No new access token; redirect to login URL
      return ctx.redirect($auth.options.redirect.login, { redirect: ctx.route.path });
    }

    updateRefreshToken($auth, refreshAccessTokenResponse);

    // Retry request with new access token
    return ctx.$axios.request(requestConfig);
  };

  const keycloakUnauthorizedResponseErrorHandler = ({ $auth, route }, error) => {
    if (getRefreshToken()) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired
      return refreshAccessToken(error.config);
    } else {
      // User has not already logged in, or we have no refresh token:
      // redirect to OIDC login URL
      return ctx.redirect($auth.options.redirect.login, { redirect: route.path });
    }
  };

  const redirectPath = () => {
    let redirect = '/account';

    if (ctx.route) {
      if (ctx.route.query?.redirect) {
        redirect = ctx.route.query.redirect;
      } else if (ctx.route.path?.endsWith('/account/login')) {
        redirect = `/account${ctx.route.hash || ''}`;
      } else if (ctx.route.fullPath) {
        if (ctx.route.fullPath !== '/account/kallback') {
          redirect = ctx.route.fullPath;
        }
      }
    }

    return redirect;
  };

  const accountUrl = () => {
    const keycloakAccountUrl = new URL(
      `/auth/realms/${config.realm}/account`, config.origin
    );
    keycloakAccountUrl.search = new URLSearchParams({
      referrer: config.clientId,
      'referrer_uri': ctx.$config.app.baseUrl
    }).toString();
    return keycloakAccountUrl.toString();
  };

  const goToKeycloakEndpoint = (endpoint, { params = {}, replace = false } = {}) => {
    const url = new URL(endpoints[endpoint]);
    url.search = new URLSearchParams(params);

    if (replace) {
      window.location.replace(url);
    } else {
      window.location = url;
    }
  };

  const redirectUri = (action, { redirect } = {}) => {
    const url = new URL(appUrl(callbackPaths[action]));
    url.search = new URLSearchParams({
      redirect: redirect || redirectPath()
    });
    return url.toString();
  };

  const login = ({ redirect, replace = false } = {}) => {
    const params = {
      protocol: 'oauth2',
      'response_type': config.responseType,
      'access_type': config.accessType,
      'client_id': config.clientId,
      'redirect_uri': redirectUri('login', { redirect }),
      scope,
      state: nanoid(),
      'ui_locales': ctx.i18n.locale
    };

    storage.local.set('state', params.state);
    storage.local.set('redirect_uri', params.redirect_uri);

    goToKeycloakEndpoint('auth', { params, replace });
  };

  const loginCallback = async() => {
    // console.log('keycloak callback route', ctx.route.query)

    console.log('loginCallback ctx.route.query', ctx.route.query);

    const routeQueryState = ctx.route.query.state;
    const storedState = storage.local.get('state');

    storage.local.remove('state');

    if (!routeQueryState || !storedState || (routeQueryState !== storedState)) {
      // TODO: use http-errors
      throw new Error('Unauthorised');
    }

    console.log('authorised!');

    const tokenRequestConfig = {
      url: endpoints.token,
      method: 'post',
      data: new URLSearchParams({
        'code': ctx.route.query.code,
        'response_type': config.responseType,
        'client_id': config.clientId,
        'grant_type': config.grantType,
        'redirect_uri': storage.local.get('redirect_uri')
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };
    storage.local.remove('redirect_uri');
    const tokenResponse = await ctx.$axios.request(tokenRequestConfig);
    console.log('tokenResponse', tokenResponse);

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    // TODO: consider & test expiration of these
    storage.cookies.set('accessToken', tokenResponse.data.access_token);
    storage.cookies.set('refreshToken', tokenResponse.data.refresh_token);

    await getUserInfo();

    console.log('redirect to', ctx.route.query.redirect || '/');
    ctx.redirect(ctx.route.query.redirect || '/');
  };

  const logout = ({ replace = false } = {}) => {
    const params = {
      'redirect_uri': redirectUri('logout'),
      'ui_locales': ctx.i18n.locale
    };

    goToKeycloakEndpoint('logout', { params, replace });
  };

  const logoutCallback = () => {
    console.log('logoutCallback ctx.route.query', ctx.route.query);

    storage.cookies.remove('accessToken');
    storage.cookies.remove('refreshToken');

    console.log('redirect to', ctx.route.query.redirect || '/');
    ctx.redirect(ctx.route.query.redirect || '/');
  };

  // FIXME: how was this getting called previously?
  const error = (err) => {
    if (err.response?.status === 401) {
      return keycloakUnauthorizedResponseErrorHandler(ctx, err);
    } else {
      return Promise.reject(err);
    }
  };

  // TODO: avoid this being made on both server- and client-
  //       side; by having the user data served and hydrated?
  const getUserInfo = async() => {
    try {
      const response = await ctx.$axios.request({
        url: endpoints.userinfo,
        method: 'get',
        headers: {
          authorization: `Bearer ${storage.cookies.get('accessToken')}`
        },
        params: {
          'client_id': config.clientId
        }
      });
      user = response.data;
    } catch (e) {
      console.error(e);
    }
  };

  const userHasClientRole = (client, role) => {
    return user?.resource_access?.[client]?.roles?.includes(role) || false;
  };

  // TODO: assess which of these should be returned
  return {
    get accessToken() {
      return storage.cookies.get('accessToken');
    },
    get accountUrl() {
      return accountUrl();
    },
    config,
    endpoints,
    error,
    getUserInfo,
    get loggedIn() {
      console.log('get loggedIn', !!user)
      return !!user;
    },
    login,
    loginCallback,
    logout,
    logoutCallback,
    redirectPath,
    get refreshToken() {
      return storage.cookies.get('refreshToken');
    },
    get storage() {
      return storage;
    },
    get user() {
      return user;
    },
    userHasClientRole
  };
};

export default async(ctx, inject) => {
  console.log('register plugin')
  const plugin = createKeycloakPlugin(ctx);

  if (plugin.accessToken && !plugin.user) {
    // get userinfo
    await plugin.getUserInfo();
  }

  // console.log('keycloak plugin')
  inject(PLUGIN_NAME, plugin);
};
