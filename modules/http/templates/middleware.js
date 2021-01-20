// When Nuxt is built, ../middleware points to .nuxt/middleware.js
import middleware from '../middleware';

import {
  currentHost, isHttps, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from './utils';

middleware.sslNegotiation = async(context) => {
  const negotiate = (context) => {
    const ssl = isHttps(context);
    const routeBlacklisted = routeOnDatasetBlacklist(context.route, context.$config.http.sslNegotiation.datasetBlacklist);

    let redirectToScheme;
    let redirectToPort = '';

    if (ssl && routeBlacklisted) {
      // redirect to non-ssl
      redirectToScheme = 'http';
      redirectToPort = context.store.state.http.httpPort;
    } else if (!ssl && !routeBlacklisted) {
      // redirect to ssl
      redirectToScheme = 'https';
      redirectToPort = context.store.state.http.httpsPort;
    } else {
      return;
    }

    const host = currentHost(context).split(':')[0];
    const redirectToUrl = `${redirectToScheme}://${host}${redirectToPort}${context.route.fullPath}`;

    return context.redirect(redirectToUrl);
  };

  await context.store.dispatch('http/init', context);

  if (!context.$config.http.sslNegotiation.enabled || routePermittedOnEitherScheme(context.route)) return;

  return negotiate(context);
};
