// TODO: redirects should strip port from host and replace with customisable
//       port for other scheme

import { isHttps, currentHost } from '../plugins/http';
import {
  sslNegotiationEnabled, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from '../plugins/ssl';

export default async({ route, req, redirect }) => {
  if (!sslNegotiationEnabled || routePermittedOnEitherScheme(route)) return;

  const ssl = isHttps({ req });
  const routeBlacklisted = routeOnDatasetBlacklist(route);

  let redirectToScheme;

  if (ssl && routeBlacklisted) {
    // redirect to non-ssl
    redirectToScheme = 'http';
  } else if (!ssl && !routeBlacklisted) {
    // redirect to ssl
    redirectToScheme = 'https';
  } else {
    return;
  }

  const host = currentHost({ req });
  const redirectToUrl = `${redirectToScheme}://${host}${route.fullPath}`;

  return redirect(redirectToUrl);
};
