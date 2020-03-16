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

  inject('path', path);
};
