import { nanoid } from 'nanoid';

// TODO: or is this largely compatible with any OIDC provider?
const PLUGIN_NAME = 'keycloak';

// TODO: consider whether everything belongs inside here, esp considering it gets called
//       once on every SSR
export const createKeycloakPlugin = (ctx) => {
  const config = ctx.$config.keycloak;
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

  const getAccessToken = () => {
    return storage.cookies.get('accessToken');
  };

  const setAccessToken = (value) => {
    return storage.cookies.set('accessToken', value);
  };

  const removeAccessToken = () => {
    return storage.cookies.remove('accessToken');
  };

  const getRefreshToken = () => {
    return storage.cookies.get('refreshToken');
  };

  const setRefreshToken = (value)  => {
    return storage.cookies.set('refreshToken', value);
  };

  const removeRefreshToken = () => {
    return storage.cookies.remove('refreshToken');
  };

  const request = (config) => {
    return ctx.$axios.request(config);
  };

  const refreshAccessToken = async() => {
    const refreshAccessTokenResponse = await request({
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
    });
    console.log('refreshAccessTokenResponse', refreshAccessTokenResponse);

    setAccessToken(refreshAccessTokenResponse.access_token);
    setRefreshToken(refreshAccessTokenResponse.refresh_token);
  };

  const keycloakUnauthorizedResponseErrorHandler = (error) => {
    removeAccessToken();
    const requestConfig = error.config;

    delete requestConfig.headers['authorization'];

    if (getRefreshToken()) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired: get a new access token
      try {
        refreshAccessToken();
        requestConfig.headers['authorization'] = `Bearer ${getAccessToken()}`;
        return request(requestConfig);
      } catch {
        // Refresh token is no longer valid; clear it and try again
        // in case request does not need authorization anyway
        removeRefreshToken();
        return request(requestConfig);
      }
    } else {
      // User has not already logged in, or we have no refresh token:
      // redirect to OIDC login URL
      return login();
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
    const tokenResponse = await request(tokenRequestConfig);
    console.log('tokenResponse', tokenResponse);

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    // TODO: consider & test expiration of these
    setAccessToken(tokenResponse.data.access_token);
    setRefreshToken(tokenResponse.data.refresh_token);

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
      return keycloakUnauthorizedResponseErrorHandler(err);
    } else {
      return Promise.reject(err);
    }
  };

  const getUserInfo = async() => {
    try {
      const response = await request({
        url: endpoints.userinfo,
        method: 'get',
        headers: {
          authorization: `Bearer ${getAccessToken()}`
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
      return getAccessToken();
    },
    get accountUrl() {
      return accountUrl();
    },
    config,
    endpoints,
    error,
    getUserInfo,
    get loggedIn() {
      console.log('get loggedIn', !!user);
      return !!user;
    },
    login,
    loginCallback,
    logout,
    logoutCallback,
    redirectPath,
    get refreshToken() {
      return getRefreshToken();
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
  console.log('register plugin');
  const plugin = createKeycloakPlugin(ctx);

  if (plugin.accessToken && !plugin.user) {
    // get userinfo
    // TODO: avoid this being made on both server- and client-
    //       side; by having the user data served and hydrated?
    //       would having this be a composable instead of a plugin
    //       help w/ that?
    await plugin.getUserInfo();
  }

  inject(PLUGIN_NAME, plugin);
};
