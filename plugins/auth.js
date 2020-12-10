async function refreshAccessToken({ $auth, redirect }, requestConfig) {
  const refreshToken = $auth.getRefreshToken($auth.strategy.name);
  const options = $auth.strategy.options;
  // Nuxt Auth stores token type e.g. "Bearer " with token, but refresh_token
  // grant does not need it; remove it before sending to OIDC.
  const refreshTokenWithoutType = refreshToken.replace(new RegExp(`^${options.token_type} `), '');

  // @see https://github.com/nuxt-community/auth-module/blob/v4.9.1/lib/schemes/oauth2.js#L157-L201
  const data = await $auth.request({
    method: 'post',
    url: options.access_token_endpoint,
    baseURL: process.server ? undefined : false,
    data: new URLSearchParams({
      'client_id': options.client_id,
      'refresh_token': refreshTokenWithoutType,
      'grant_type': 'refresh_token'
    }).toString()
  });

  if (data[options.token_key]) {
    let newAccessToken = data[options.token_key];
    if (options.token_type) newAccessToken = options.token_type + ' ' + newAccessToken;
    // Store token
    $auth.setToken($auth.strategy.name, newAccessToken);
    // Set axios token
    $auth.strategy._setToken(newAccessToken); // eslint-disable-line no-underscore-dangle
    delete requestConfig.headers['Authorization'];
  } else {
    // No new access token; redirect to login URL
    return redirect($auth.options.redirect.login);
  }

  if (data[options.refresh_token_key]) {
    let newRefreshToken = data[options.refresh_token_key];
    if (options.token_type) newRefreshToken = options.token_type + ' ' + newRefreshToken;
    // Store refresh token
    $auth.setRefreshToken($auth.strategy.name, newRefreshToken);
  }

  // Retry request with new access token
  return this.request(requestConfig);
}

function errorHandler({ $auth, redirect }, error) {
  // 401 Unauthorized
  if (error.response.status === 401) {
    const refreshToken = $auth.getRefreshToken($auth.strategy.name);
    if ($auth.loggedIn && refreshToken) {
      // User has previously logged in, and we have a refresh token, e.g.
      // access token has expired
      return refreshAccessToken.call(this, error.config);
    } else {
      // User has not already logged in, or we have no refresh token:
      // redirect to OIDC login URL
      return redirect($auth.options.redirect.login);
    }
  } else {
    return Promise.reject(error);
  }
}

export default ({ $axios }) => {
  $axios.onResponseError(errorHandler);
};
