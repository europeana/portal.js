const keycloakResponseErrorHandler = (ctx, error) => {
  if (error.response?.status === 401) {
    return keycloakUnauthorizedResponseErrorHandler(ctx, error);
  } else {
    return Promise.reject(error);
  }
};

const keycloakUnauthorizedResponseErrorHandler = (ctx, error) => {
  if (ctx.$keycloak.keycloak.refreshToken) {
    // User has previously logged in, and we have a refresh token, e.g.
    // access token has expired
    return keycloakRefreshAccessToken(ctx, error.config);
  } else {
    // User has not already logged in, or we have no refresh token:
    // redirect to OIDC login URL
    return ctx.redirect('/account/login', { redirect: ctx.route.path });
  }
};

const keycloakRefreshAccessToken = async(ctx, requestConfig) => {
  const updated = await ctx.$keycloak.keycloak.updateToken(-1);
  if (updated) {
    ctx.$cookies.set('kc.token', ctx.$keycloak.keycloak.token);
    ctx.$cookies.set('kc.idToken', ctx.$keycloak.keycloak.idToken);
    ctx.$cookies.set('kc.refreshToken', ctx.$keycloak.keycloak.refreshToken);
  } else {
    // Refresh token is no longer valid; clear tokens and try again in case it
    // doesn't require auth anyway
    ctx.$keycloak.keycloak.clearToken();
  }

  // Retry request with new access token
  return ctx.$axios.request(requestConfig);
};

export default (ctx, axiosInstance) => {
  axiosInstance.interceptors.request.use((requestConfig) => {
    console.log('keycloak-axios request interceptor', requestConfig, ctx.$keycloak.keycloak.token)
    if (ctx.$keycloak.keycloak?.token) {
      requestConfig.headers.authorization = `Bearer ${ctx.$keycloak.keycloak.token}`;
    }
    return requestConfig;
  });

  if (typeof axiosInstance.onResponseError === 'function') {
    axiosInstance.onResponseError(error => keycloakResponseErrorHandler(ctx, error));
  }
};
