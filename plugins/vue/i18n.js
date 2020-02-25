// I18n function to localise into active locale if translation exists, else
// into app fallback locale, else return null.
function translateOrNull(key, values) {
  return translateWithFallbackOrNull(this, key, (locale) => this.$t(key, locale, values));
}

// I18n pluralisation function to localise into active locale if translation
// exists, else into app fallback locale, else return null.
function translateCountOrNull(key, count, values) {
  return translateWithFallbackOrNull(this, key, (locale) => this.$tc(key, count, locale, values));
}

function translateWithFallbackOrNull(scope, key, callback) {
  let translation = null;

  // Needed because VueI18n's $te function does not take into account the fallback
  // locale, i.e. is always false if the active locale does not have the key.
  if (scope.$te(key)) {
    translation = callback(null);
  } else if (scope.$i18n.locale !== scope.$i18n.fallbackLocale) {
    if (scope.$te(key, scope.$i18n.fallbackLocale)) {
      translation = callback(scope.$i18n.fallbackLocale);
    }
  }

  return translation;
}

export default {
  install(Vue) {
    Vue.prototype.$tNull = translateOrNull;
    Vue.prototype.$tcNull = translateCountOrNull;
  }
};
