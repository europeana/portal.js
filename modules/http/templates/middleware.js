// When Nuxt is built, ../middleware points to .nuxt/middleware.js
import middleware from '../middleware';

import {
  currentHost, isHttps, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from './utils';

middleware.sslNegotiation = async(context) => {
  await context.store.dispatch('http/init', context);

  if (!context.app.$http.config.sslNegotiation.enabled || routePermittedOnEitherScheme(context.route)) return;

  const ssl = isHttps(context);
  const routeBlacklisted = routeOnDatasetBlacklist(context.route);

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
