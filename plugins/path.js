import { URL, URLSearchParams } from './url';
import {
  sslNegotiationEnabled, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from '../plugins/ssl';

export default ({ app, store }, inject) => {
  const path = (route) => {
    const localePath = app.localePath(route);

    if (!sslNegotiationEnabled || routePermittedOnEitherScheme(route)) return localePath;

    const routeBlacklisted = routeOnDatasetBlacklist(route);

    // TODO: observe ssl feature toggle
    let switchToProtocol;
    if (routeBlacklisted && store.state.http.protocol === 'https:') {
      switchToProtocol = 'http:';
    } else if (!routeBlacklisted && store.state.http.protocol === 'http:') {
      switchToProtocol = 'https:';
    }

    if (!switchToProtocol) return localePath;

    return `${switchToProtocol}//${store.state.http.host}${localePath}`;
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
