import {
  routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from './utils';

export default ({ app, store, $config }, inject) => {
  const path = (route) => {
    if (!route.params) {
      route.params = {};
    }
    if (!route.params.locale) {
      route.params.locale = app.i18n.locale;
    }
    const localePath = app.localePath(route);

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
