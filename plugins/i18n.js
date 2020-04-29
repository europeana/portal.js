/*
 * Adds the isoLocale function to i18n.
 * Used to lookup the iso code for the currently selected locale.
 */
export default ({ app }) => {
  const locales = app.i18n.locales;
  // Set the function directly on the context.app object
  app.i18n.isoLocale = function() {
    return locales.find(locale => locale.code === app.i18n.locale)['iso'];
  };
};
