import { isHttps, currentHost } from '../plugins/http';
import {
  sslNegotiationEnabled, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from '../plugins/ssl';

export default async({ store, route, req, redirect }) => {
  if (!sslNegotiationEnabled || routePermittedOnEitherScheme(route)) return;

  const ssl = isHttps({ req });
  const routeBlacklisted = routeOnDatasetBlacklist(route);

  let redirectToScheme;
  let redirectToPort = '';

  if (ssl && routeBlacklisted) {
    // redirect to non-ssl
    redirectToScheme = 'http';
    redirectToPort = store.state.http.httpPort;
  } else if (!ssl && !routeBlacklisted) {
    // redirect to ssl
    redirectToScheme = 'https';
    redirectToPort = store.state.http.httpsPort;
  } else {
    return;
  }

  const host = currentHost({ req }).split(':')[0];
  const redirectToUrl = `${redirectToScheme}://${host}${redirectToPort}${route.fullPath}`;

  return redirect(redirectToUrl);
};
