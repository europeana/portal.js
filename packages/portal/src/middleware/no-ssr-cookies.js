export default ({ $cookies, res }) => {
  if (!res) {
    // client-side: no response object; nothing to do here
    return;
  }

  // auth plugin always needs to be able to set token-related cookies
  // in case they need to be refreshed or expired, whether logged-in or not
  // TODO: remove any others, though?
  const hasAuthTokenCookies = !!$cookies.get('auth.access_token') || !!$cookies.get('auth.refresh_token');

  if (!hasAuthTokenCookies) {
    res.removeHeader('Set-Cookie');
  }
};
