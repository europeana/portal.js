// l10n middleware to redirect requests for URL paths without locale prefixes
// to the equivalent URL prefixed with the user's preferred locale.
//
// (Named "l10n" and not "i18n" as the latter is already taken by nuxt-i18n.)
//
// This duplicates the browser language detection functionality of the nuxt-i18n
// package but with additional redirection handling for requests to URL paths
// without the language in them.

const COOKIE_NAME = 'i18n_locale_code';

// Codes of all languages supported by the app
import localeCodes from '../plugins/i18n/codes';

function appSupportsLocale(locale) {
  return locale && localeCodes.includes(locale);
}

const localiseRoute = ({ route, req, redirect, app }) => {
  if (app.$apm && process.server) {
    app.$apm.setTransactionName(`${req.method} [l10n]`);
  }
  redirect(route);
};

export default ({ app, route, redirect, req }) => {
  // Exit early if route path is to DS4CH (non i18n page) or it is an auth callback
  if (['/microsite/DS4CH.eu'].includes(route.path) || (app.$auth && [
    app.$auth.options.redirect.callback,
    '/account/logout'
  ].includes(route.path))) {
    return;
  }

  // Is there a locale in the URL path already?
  if ((route.path.length === 3 || route.path.slice(3, 4) === '/')) {
    const routePathLocale = route.path.slice(1, 3);
    if (appSupportsLocale(routePathLocale)) {
      // Store it in the cookie, indicating user's current preference e.g. from
      // using language selector
      app.$cookies.set(COOKIE_NAME, routePathLocale);
      // Carry on processing the request.
      return;
    } else {
      // Remove unsupported locale from URL
      localiseRoute({
        route: {
          path: route.path.slice(3) || '/',
          query: route.query
        },
        req,
        redirect,
        app
      });
      return;
    }
  }

  // Prefer locale stored in cookie
  let browserLocale = app.$cookies.get(COOKIE_NAME);

  if (!appSupportsLocale(browserLocale)) {
    // Get browser language either from navigator if running on client side, else from the request headers
    if (process.client && typeof navigator !== 'undefined' && navigator.language) {
      browserLocale = navigator.language.toLocaleLowerCase().substring(0, 2);
    } else if (req && typeof req.headers['accept-language'] !== 'undefined') {
      browserLocale = req.headers['accept-language'].split(',')[0].toLocaleLowerCase().substring(0, 2);
    }

    // Fallback to default locale if browser language not registered in the app
    if (!appSupportsLocale(browserLocale)) {
      browserLocale = app.i18n.fallbackLocale;
    }

    // Store in the cookie for future requests
    app.$cookies.set(COOKIE_NAME, browserLocale);
  }

  const i18nPath = route.path === '/' ? `/${browserLocale}` : `/${browserLocale}${route.path}`;
  localiseRoute({
    route: {
      path: i18nPath,
      query: route.query
    },
    req,
    redirect,
    app
  });
};
