// TODO: shouldn't this be client-only?

import qs from 'qs';
import nanoid from 'nanoid';

const PLUGIN_NAME = 'keycloak';

// @see https://github.com/nuxt-community/auth-module/blob/v4.9.1/lib/schemes/oauth2.js#L157-L201
const refreshAccessToken = async({ $auth, $axios, redirect, route }, requestConfig) => {
  let refreshAccessTokenResponse;
  try {
    refreshAccessTokenResponse = await $auth.request(refreshAccessTokenRequestOptions($auth));
  } catch {
    // Refresh token is no longer valid; clear tokens and try again
    $auth.logout();
    delete requestConfig.headers['Authorization'];
    delete requestConfig.headers['authorization'];
    return $axios.request(requestConfig);
  }

  if (!updateAccessToken($auth, requestConfig, refreshAccessTokenResponse)) {
    // No new access token; redirect to login URL
    return redirect($auth.options.redirect.login, { redirect: route.path });
  }

  updateRefreshToken($auth, refreshAccessTokenResponse);

  // Retry request with new access token
  return $axios.request(requestConfig);
};

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

const updateAccessToken = ($auth, requestConfig, refreshAccessTokenResponse) => {
  const options = $auth.strategy.options;

  let newAccessToken = refreshAccessTokenResponse[options.token_key];
  if (!newAccessToken) {
    return false;
  }

  if (options.token_type) {
    newAccessToken = `${options.token_type} ${newAccessToken}`;
  }

  // Store token
  $auth.setToken($auth.strategy.name, newAccessToken);

  // Set axios token
  $auth.strategy._setToken(newAccessToken); // eslint-disable-line no-underscore-dangle

  delete requestConfig.headers['Authorization'];
  delete requestConfig.headers['authorization'];
  // TODO: use axios instead of $axios, and set new Authorization header here
  //       from newAccessToken?

  return newAccessToken;
};

const refreshAccessTokenRequestOptions = ($auth) => {
  const refreshToken = $auth.getRefreshToken($auth.strategy.name);
  const options = $auth.strategy.options;
  // Nuxt Auth stores token type e.g. "Bearer " with token, but refresh_token
  // grant does not need it; remove it before sending to OIDC.
  const refreshTokenWithoutType = refreshToken.replace(new RegExp(`^${options.token_type} `), '');

  return {
    method: 'post',
    url: options.access_token_endpoint,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: new URLSearchParams({
      'client_id': options.client_id,
      'refresh_token': refreshTokenWithoutType,
      'grant_type': 'refresh_token'
    }).toString()
  };
};

const keycloakUnauthorizedResponseErrorHandler = ({ $auth, $axios, redirect, route }, error) => {
  if ($auth.getRefreshToken($auth.strategy.name)) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return refreshAccessToken({ $auth, $axios, redirect, route }, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return redirect($auth.options.redirect.login, { redirect: route.path });
  }
};

export const createKeycloakPlugin = (ctx) => {
  const config = ctx.$config.oauth;
  const router = ctx.app.router;
  // console.log('oauth config', config)
  const scope = config.scope.join(' ');
  const callbackUri = `${ctx.$config.app.baseUrl}/account/kallback`;
  const url = `${config.origin}/auth/realms/${config.realm}/protocol/openid-connect`;
  const endpoints = {
    auth: `${url}/auth`,
    logout: `${url}/logout`,
    token: `${url}/token`,
    userinfo: `${url}/userinfo`
  };

  let user = null;

  const storageKey = (key) => `${PLUGIN_NAME}.${key}`;
  const storage = {
    // TODO: client-side only?
    client: {
      get: (key) => localStorage.getItem(storageKey(key)),
      set: (key, value) => localStorage.setItem(storageKey(key), value),
      remove: (key) => localStorage.removeItem(storageKey(key))
    },
    shared: {
      get: (key) => ctx.$cookies.get(storageKey(key)),
      set: (key, value) => ctx.$cookies.set(storageKey(key), value)
      // remove
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
      `/auth/realms/${ctx.$auth.strategy.options.realm}/account`, ctx.$auth.strategy.options.origin
    );
    keycloakAccountUrl.search = new URLSearchParams({
      referrer: ctx.$auth.strategy.options.client_id,
      'referrer_uri': ctx.$config.app.baseUrl
    }).toString();
    return keycloakAccountUrl.toString();
  };

  const login = ({ params, nonce, redirect, replace, state } = {}) => {
    // TODO: is this redundant now?
    storage.client.set('redirect', redirect || redirectPath());
    storage.client.set('portalLoggingIn', true);
    // ctx.$auth.loginWith('keycloak', { params: { 'ui_locales': ctx.i18n.locale }, replace });

    const redirectUri = new URL(callbackUri)
    redirectUri.search = new URLSearchParams({
      redirect: redirect || redirectPath()
    })

    const opts = {
      protocol: 'oauth2',
      'response_type': config.responseType,
      'access_type': config.accessType,
      'client_id': config.clientId,
      'redirect_uri': redirectUri.toString(),
      scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: state || nanoid(),
      ...params
    };

    // Set Nonce Value if response_type contains id_token to mitigate Replay Attacks
    // More Info: https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
    // More Info: https://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-06#section-4.6.2
    if (opts.response_type.includes('id_token')) {
      // nanoid auto-generates an URL Friendly, unique Cryptographic string
      // Recommended by Auth0 on https://auth0.com/docs/api-auth/tutorials/nonce
      opts.nonce = nonce || nanoid();
    }

    storage.client.set('state', opts.state);
    storage.client.set('redirect_uri', opts.redirect_uri);

    // TODO: use URL class
    const url = new URL(endpoints.auth);
    url.search = new URLSearchParams(opts);

    console.log('off to keycloak!', url);
    if (replace) {
      window.location.replace(url);
    } else {
      window.location = url;
    }
  };

  const callback = async() => {
    // console.log('keycloak callback route', ctx.route.query)

    const routeQueryState = ctx.route.query.state;
    const storedState = storage.client.get('state');

    storage.client.remove('state');

    if (!routeQueryState || !storedState || (routeQueryState !== storedState)) {
      // TODO: use http-errors
      throw new Error('Unauthorised');
    }

    console.log('authorised!')

    const tokenRequestConfig = {
      url: endpoints.token,
      method: 'post',
      data: qs.stringify({
        'code': ctx.route.query.code,
        'response_type': config.responseType,
        'client_id': config.clientId,
        'grant_type': config.grantType,
        'redirect_uri': storage.client.get('redirect_uri')
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
    storage.client.remove('redirect_uri');
    const tokenResponse = await ctx.$axios.request(tokenRequestConfig);
    // console.log('tokenResponse', tokenResponse)

    storage.shared.set('accessToken', tokenResponse.data.access_token)
    storage.shared.set('refreshToken', tokenResponse.data.refresh_token)

    router.replace(ctx.route.query.redirect || '/');
  };

  const error = (err) => {
    if (err.response?.status === 401) {
      return keycloakUnauthorizedResponseErrorHandler(ctx, err);
    } else {
      return Promise.reject(err);
    }
  };

  // const getTokens = async(code) => {

  // };

  // TODO: avoid this being made on both server- and client-
  //       side, by having the user data served and hydrated
  const getUserInfo = async() => {
    try {
      const response = await ctx.$axios.request({
        url: endpoints.userinfo,
        method: 'get',
        headers: {
          authorization: `Bearer ${storage.shared.get('accessToken')}`
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
      return storage.shared.get('accessToken')
    },
    accountUrl,
    callback,
    config,
    endpoints,
    error,
    getUserInfo,
    get loggedIn() {
      return !!user;
    },
    login,
    redirectPath,
    get refreshToken() {
      return storage.shared.get('refreshToken')
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
  const plugin = createKeycloakPlugin(ctx);

  if (plugin.accessToken && !plugin.user) {
    // get userinfo
    await plugin.getUserInfo();
  }

  // console.log('keycloak plugin')
  inject(PLUGIN_NAME, plugin);
};
