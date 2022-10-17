import { codes as localeCodes } from '@europeana/i18n';

const COOKIE_NAME = 'i18n_locale_code';

function appSupportsLocale(locale) {
  return locale && localeCodes.includes(locale);
}

export default (req, res) => {
  // TODO: restore exiting early if locale already present

  // Prefer locale stored in cookie
  let prefLocale = req.cookies[COOKIE_NAME];

  if (!appSupportsLocale(prefLocale)) {
    // Get browser language from the request headers
    const acceptLanguage = req.get('accept-language');
    if (acceptLanguage) {
      prefLocale = acceptLanguage.split(',')[0].toLocaleLowerCase().substring(0, 2);
    }

    // Fallback to default locale if browser language not registered in the app
    if (!appSupportsLocale(prefLocale)) {
      prefLocale = 'en';
    }

    // Store in the cookie for future requests
    res.set('set-cookie', `${COOKIE_NAME}=${prefLocale}; Path=/`);
  }

  const url = req.path === '/' ? `/${prefLocale}${req.url.slice(1)}` : `/${prefLocale}${req.url}`;

  res.redirect(url);
};
