// When Nuxt is built, ../middleware points to .nuxt/middleware.js
import middleware from '../middleware';

middleware.http = async(context) => {
  await context.store.dispatch('http/init', context);

  if (!context.app.$http.sslNegotiationEnabled || context.app.$http.routePermittedOnEitherScheme(context.route)) return;

  const ssl = context.app.$http.isHttps(context);
  const routeBlacklisted = context.app.$http.routeOnDatasetBlacklist(context.route);

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

  const host = context.app.$http.currentHost(context).split(':')[0];
  const redirectToUrl = `${redirectToScheme}://${host}${redirectToPort}${context.route.fullPath}`;

  return context.redirect(redirectToUrl);
};
