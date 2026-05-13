import axios from 'axios';
import { nanoid } from 'nanoid';

const PLUGIN_NAME = 'auth';
const STATE_KEY = `$${PLUGIN_NAME}`;

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
  const callbackPaths = {
    login: '/auth/logincb',
    logout: '/auth/logoutcb'
  };

  let user = null;

  const userIsLoggedIn = () => !!user;

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
    return axios.request(config);
  };

  const requestWithAuth = config => {
    const axiosInstance = axios.create();
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => handleRequestError(error)
    );
    return axiosInstance.request({
      headers: {
        authorization: `Bearer ${getAccessToken()}`,
        ...config.headers
      },
      ...config
    });
  };

  const refreshAccessToken = async() => {
    const data = new FormData();
    data.set('client_id', config.clientId);
    data.set('refresh_token', getRefreshToken());
    data.set('grant_type', 'refresh_token');
    data.set('scope', scope);
    const refreshAccessTokenResponse = await request({
      method: 'post',
      url: endpoints.token,
      data: data.toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    setAccessToken(refreshAccessTokenResponse.access_token);
    setRefreshToken(refreshAccessTokenResponse.refresh_token);
  };

  const handleUnauthorizedError = async(error) => {
    removeAccessToken();
    const requestConfig = error.config;

    if (getRefreshToken()) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired: get a new access token
      try {
        await refreshAccessToken();
        return requestWithAuth(requestConfig);
      } catch (err) {
        // Refresh token is no longer valid; clear it and try again
        // in case request does not need authorization anyway
        delete requestConfig.headers['authorization'];
        removeRefreshToken();
        user = null;
        return request(requestConfig);
      }
    } else {
      // User has not already logged in, or we have no refresh token:
      // redirect to OIDC login URL
      // TODO: is this the appropriate action here? or should we throw the error again?
      //       for callers to trigger login if they deem appropriate
      return login();
    }
  };

  const redirectPath = () => {
    let redirect = '/account';

    // TODO: reassess the logic
    if (ctx.route) {
      if (ctx.route.query?.redirect) {
        redirect = ctx.route.query.redirect;
      } else if (ctx.route.path?.endsWith('/auth/login')) {
        redirect = `/account${ctx.route.hash || ''}`;
      } else if (ctx.route.fullPath) {
        if (ctx.route.fullPath !== '/auth/logincb') {
          redirect = ctx.route.fullPath;
        }
      }
    }

    return redirect;
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

  const goToAuthEndpoint = (endpoint, { params = {}, replace = false } = {}) => {
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

    goToAuthEndpoint('auth', { params, replace });
  };

  const loginCallback = async() => {
    if (userIsLoggedIn()) {
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
        'response_type': config.responseType,
        'client_id': config.clientId,
        'grant_type': config.grantType,
        'redirect_uri': storage.local.get('redirect_uri')
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };
    storage.local.remove('redirect_uri');
    const tokenResponse = await request(tokenRequestConfig);

    // TODO: id token validation
    //       https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation

    // TODO: consider & test expiration of these
    setAccessToken(tokenResponse.data.access_token);
    setRefreshToken(tokenResponse.data.refresh_token);

    await getUserInfo();

    ctx.app.router.replace(ctx.route.query.redirect || '/');
  };

  const logout = ({ replace = false } = {}) => {
    const params = {
      'redirect_uri': redirectUri('logout'),
      'ui_locales': ctx.i18n.locale
    };

    goToAuthEndpoint('logout', { params, replace });
  };

  const logoutCallback = () => {
    removeAccessToken();
    removeRefreshToken();
    user = null;

    ctx.app.router.replace(ctx.route.query.redirect || '/');
  };

  const handleRequestError = async(err) => {
    if (err.response?.status === 401) {
      await handleUnauthorizedError(err);
    } else {
      Promise.reject(err);
    }
  };

  const getUserInfo = async() => {
    const response = await requestWithAuth({
      url: endpoints.userinfo,
      method: 'get',
      params: {
        'client_id': config.clientId
      }
    });
    user = response.data;
  };

  const initUserInfo = async() => {
    if (getAccessToken() && !user && (ctx.route.path !== callbackPaths.logout)) {
      if (ctx.nuxtState?.[STATE_KEY]?.user) {
        user = ctx.nuxtState[STATE_KEY].user;
      } else {
        await getUserInfo();
        // store it in the nuxt state for hydration to prevent re-calling getUserInfo client-side
        ctx.beforeSerialize?.((nuxtState) => {
          nuxtState[STATE_KEY] ||= {};
          nuxtState[STATE_KEY].user = user;
        });
      }
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
    handleRequestError,
    getUserInfo,
    initUserInfo,
    get loggedIn() {
      return userIsLoggedIn();
    },
    login,
    loginCallback,
    logout,
    logoutCallback,
    redirectPath,
    get refreshToken() {
      return getRefreshToken();
    },
    request,
    requestWithAuth,
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
  const plugin = createAuthPlugin(ctx);

  await plugin.initUserInfo();

  inject(PLUGIN_NAME, plugin);
};
