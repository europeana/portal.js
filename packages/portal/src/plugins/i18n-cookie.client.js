export default ({ app }) => {
  app.$cookies.set('i18n_locale_code', app.i18n.locale);
};
