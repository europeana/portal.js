import camelCase from 'lodash/camelCase.js';

const setCacheControl = (res, value) => {
  res?.removeHeader('Cache-Control');
  value && res?.setHeader('Cache-Control', value);
};

export default ({ $auth, $config, res, route }) => {
  const config = $config?.app?.cacheControl || {};

  if (!config.enabled) {
    return;
  }

  // convert e.g. "item-all___en" to "itemAll"
  const scope = camelCase(route?.name?.split('___')?.[0]);

  let headerValue = config.default;
  if ($auth?.loggedIn) {
    headerValue = config.auth;
  } else if (config.route?.[scope]) {
    headerValue = config.route[scope];
  }

  setCacheControl(res, headerValue);
};
