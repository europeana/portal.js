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

export const keycloakPlugin = (ctx) => {
  const redirectPath = () => {
    let redirect = '/account';

    if (ctx.route) {
      if (ctx.route.query?.redirect) {
        redirect = ctx.route.query.redirect;
      } else if (ctx.route.path?.endsWith('/account/login')) {
        redirect = `/account${ctx.route.hash || ''}`;
      } else if (ctx.route.fullPath) {
        redirect = ctx.route.fullPath;
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

  const login = ({ redirect } = {}) => {
    ctx.$auth.$storage.setUniversal('redirect', redirect || redirectPath());
    ctx.$auth.$storage.setUniversal('portalLoggingIn', true);
    ctx.$auth.loginWith('keycloak', { params: { 'ui_locales': ctx.i18n.locale } });
  };

  const error = (err) => {
    if (err.response?.status === 401) {
      return keycloakUnauthorizedResponseErrorHandler(ctx, err);
    } else {
      return Promise.reject(err);
    }
  };

  return {
    accountUrl,
    error,
    login,
    redirectPath
  };
};

export default (ctx, inject) => {
  inject('keycloak', keycloakPlugin(ctx));
};
