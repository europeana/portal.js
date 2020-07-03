import { URL, URLSearchParams } from './url';

// TODO: move to http module?
export default ({ app, store }, inject) => {
  const path = (route) => {
    const localePath = app.localePath(route);

    if (!app.$http.config.sslNegotiation.enabled || app.$http.routePermittedOnEitherScheme(route)) return localePath;

    const routeBlacklisted = app.$http.routeOnDatasetBlacklist(route);

    // TODO: observe ssl feature toggle
    let switchToProtocol;
    let switchToPort;
    if (routeBlacklisted && store.state.http.protocol === 'https:') {
      switchToProtocol = 'http:';
      switchToPort = store.state.http.httpPort;
    } else if (!routeBlacklisted && store.state.http.protocol === 'http:') {
      switchToProtocol = 'https:';
      switchToPort = store.state.http.httpsPort;
    }

    if (!switchToProtocol) return localePath;

    const portlessHost = store.state.http.host.split(':')[0];

    return `${switchToProtocol}//${portlessHost}${switchToPort}${localePath}`;
  };

  const goto = (route) => {
    if (typeof route === 'string' && route.includes('://')) {
      window.location.href = route;
    } else if (typeof route === 'object' && route.path.includes('://')) {
      const url = new URL(route.path);
      url.search = new URLSearchParams(route.query);
      window.location.href = url.toString();
    } else {
      app.router.push(route);
    }
  };

  inject('path', path);
  inject('goto', goto);
};
