// @see https://github.com/nuxt-community/auth-module/blob/v4.9.1/lib/schemes/oauth2.js#L157-L201
const refreshAccessToken = async({ $auth, $axios, redirect }, requestConfig) => {
  const refreshAccessTokenResponse = await $auth.request(refreshAccessTokenRequestOptions($auth));

  if (!updateAccessToken($auth, requestConfig, refreshAccessTokenResponse)) {
    // No new access token; redirect to login URL
    return redirect($auth.options.redirect.login);
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
    newRefreshToken = options.token_type + ' ' + newRefreshToken;
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
    newAccessToken = options.token_type + ' ' + newAccessToken;
  }

  // Store token
  $auth.setToken($auth.strategy.name, newAccessToken);

  // Set axios token
  $auth.strategy._setToken(newAccessToken); // eslint-disable-line no-underscore-dangle

  delete requestConfig.headers['Authorization'];

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
    baseURL: process.server ? undefined : false,
    data: new URLSearchParams({
      'client_id': options.client_id,
      'refresh_token': refreshTokenWithoutType,
      'grant_type': 'refresh_token'
    }).toString()
  };
};

export const keycloakResponseErrorHandler = (context, error) => {
  if (error.response.status === 401) {
    return keycloakUnauthorizedResponseErrorHandler(context, error);
  } else {
    return Promise.reject(error);
  }
};

const keycloakUnauthorizedResponseErrorHandler = ({ $auth, $axios, redirect }, error) => {
  if ($auth.loggedIn && $auth.getRefreshToken($auth.strategy.name)) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return refreshAccessToken({ $auth, $axios, redirect }, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return redirect($auth.options.redirect.login);
  }
};
