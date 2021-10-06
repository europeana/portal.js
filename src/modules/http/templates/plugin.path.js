import {
  routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from './utils';

// TODO: does this belong here, or should it go into a new l10n plugin or such?
const routeWithLocale = (route, locale) => {
  if (typeof route === 'string') {
    if (!new RegExp(`^/${locale}(/|$)`).test(route)) {
      route = `/${locale}${route}`;
    }
  } else {
    if (!route.params) {
      route.params = {};
    }
    if (!route.params.locale) {
      route.params.locale = locale;
    }
  }
  return route;
};

export default ({ app, store, $config }, inject) => {
  const path = (route) => {
    const localePath = app.localePath(routeWithLocale(route, app.i18n.locale));

    if (!$config.http.sslNegotiation.enabled || routePermittedOnEitherScheme(route)) {
      return localePath;
    }

    const routeBlacklisted = routeOnDatasetBlacklist(route, $config.http.sslNegotiation.datasetBlacklist);

    let switchToProtocol;
    let switchToPort;
    if (routeBlacklisted && store.state.http.protocol === 'https:') {
      switchToProtocol = 'http:';
      switchToPort = store.state.http.httpPort;
    } else if (!routeBlacklisted && store.state.http.protocol === 'http:') {
      switchToProtocol = 'https:';
      switchToPort = store.state.http.httpsPort;
    }

    if (!switchToProtocol) {
      return localePath;
    }

    const portlessHost = store.state.http.host.split(':')[0];

    return `${switchToProtocol}//${portlessHost}${switchToPort}${localePath}`;
  };

  inject('path', path);
};
