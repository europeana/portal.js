const setCacheControl = (res, value) => {
  res?.removeHeader('Cache-Control');
  value && res?.setHeader('Cache-Control', value);
};

export const createCacheControlMiddleware = (scope) => ({ $auth, $config, res }) => {
  const config = $config?.app?.cacheControl;

  if (config.enabled) {
    setCacheControl(res, $auth?.loggedIn ? config.auth : config[scope]);
  }
};

export default createCacheControlMiddleware('default');
