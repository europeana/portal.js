// Codes of all languages supported by the app
import localeCodes from '../plugins/i18n/codes';

const appSupportsLocale = locale => (locale && localeCodes.includes(locale));

export default ({ app, route, redirect, $config }) => {
  // Exit early if this is a route excluded from i18n
  if ($config.app.i18nExclusions.includes(route.path)) {
    return;
  }

  if (appSupportsLocale(route.params.locale)) {
    app.i18n.setLocale(route.params.locale);
  } else {
    // TODO: 404 if unsupported locale instead of redirecting?
    const pathNoLocale = route.path.replace(/^\/[a-z]{2}\//, '/');
    const pathAppLocale = `/${app.i18n.locale}${pathNoLocale}`;
    const pathNoTrailingSlash = pathAppLocale.replace(/\/$/, '');
    redirect(pathNoTrailingSlash);
  }
};
