// When Nuxt is built, ../middleware points to .nuxt/middleware.js
import middleware from '../middleware';

import {
  currentHost, isHttps
} from './utils';

const negotiate = (context) => {
  const ssl = isHttps(context);

  if (ssl) {
    return;
  }

  // redirect to ssl
  const redirectToScheme = 'https';
  const redirectToPort = context.store.state.http.httpsPort;

  const host = currentHost(context).split(':')[0];
  const redirectToUrl = `${redirectToScheme}://${host}${redirectToPort}${context.route.fullPath}`;

  context.redirect(redirectToUrl);
};

middleware.sslNegotiation = async(context) => {
  await context.store.dispatch('http/init', context);

  if (!context.$config.http.sslNegotiation.enabled) {
    return;
  }

  negotiate(context);
};
