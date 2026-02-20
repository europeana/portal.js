const setCacheControl = (res, value) => {
  res?.removeHeader('Cache-Control');
  value && res?.setHeader('Cache-Control', value);
};

export const createCacheControlMiddleware = (scope) => ({ $auth, $config, $features, res }) => {
  if ($features?.cacheControl) {
    if ($auth?.loggedIn && $config?.app?.cacheControl?.auth) {
      setCacheControl(res, $config.app.cacheControl.auth);
    } else if ($config?.app?.cacheControl?.[scope]) {
      setCacheControl(res, $config.app.cacheControl[scope]);
    }
  }
};

export default createCacheControlMiddleware('default');
