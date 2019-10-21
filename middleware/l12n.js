// l12n middleware to redirect requests for URL paths without locale prefixes
// to the equivalent URL prefixed with the user's preferred locale.
//
// (Named "l12n" and not "i18n" as the latter is already taken by nuxt-i18n.)
//
// This duplicates the browser language detection functionality of the nuxt-i18n
// package but with additional redirection handling for requests to URL paths
// without the language in them.

export default ({ app, route, redirect, req }) => {
  // Is there a locale in the URL path already?
  const routePathLocale = route.path.match(/^\/([a-z]{2})(\/|$)/);
  if (routePathLocale) {
    // Store it in the cookie, indicating user's current preference e.g. from
    // using language selector.
    app.$cookies.set('i18n_locale_code', routePathLocale[1]);
    // Carry on processing the request.
    return;
  }

  // Prefer locale stored in cookie.
  let browserLocale = app.$cookies.get('i18n_locale_code');
  if (!browserLocale) {
    // Get browser language either from navigator if running on client side, else from the request headers
    if (process.client && typeof navigator !== 'undefined' && navigator.language) {
      browserLocale = navigator.language.toLocaleLowerCase().substring(0, 2);
    } else if (req && typeof req.headers['accept-language'] !== 'undefined') {
      browserLocale = req.headers['accept-language'].split(',')[0].toLocaleLowerCase().substring(0, 2);
    }

    // Fallback to default locale if browser language not registered in the app
    const registeredLocales = app.i18n.locales.map(locale => locale.code);
    if (!browserLocale || !registeredLocales.includes(browserLocale)) {
      browserLocale = app.i18n.fallbackLocale;
    }

    // Store in the cookie for future requests
    app.$cookies.set('i18n_locale_code', browserLocale);
  }

  const i18nPath = route.path === '/' ? `/${browserLocale}` : `/${browserLocale}${route.path}`;
  return redirect({
    path: i18nPath,
    query: route.query
  });
};
