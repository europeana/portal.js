// Codes of all languages supported by the app
import localeCodes from '../plugins/i18n/codes';

const appSupportsLocale = locale => (locale && localeCodes.includes(locale));

export default ({ app, route, redirect }) => {
  // FIXME: restore or refactor, e.g. to look in config for nuxt-i18n instead
  // Exit early if this is an auth callback
  // if (app.$auth && [
  //   app.$auth.options.redirect.callback,
  //   '/account/logout'
  // ].includes(route.path)) {
  //   return;
  // }

  if (appSupportsLocale(route.params.locale)) {
    app.i18n.setLocale(route.params.locale);
  } else {
    // TODO: check it's not an i18n excluded route (see FIXME above)
    // TODO: 404 if unsupported locale instead of redirecting?
    const pathNoLocale = route.path.replace(/^\/[a-z]{2}\//, '/');
    const pathAppLocale = `/${app.i18n.locale}${pathNoLocale}`;
    const pathNoTrailingSlash = pathAppLocale.replace(/\/$/, '');
    redirect(pathNoTrailingSlash);
  }
};
