import Vue from 'vue';
import VueI18n from 'vue-i18n';

let i18n;

if (Vue.prototype.$nuxt && Vue.prototype.$nuxt.$options.i18n) {
  // If in Nuxt, use its i18n
  i18n = Vue.prototype.$nuxt.$options.i18n;
} else {
  // Otherwise, create one and load English translations.
  // Intended to support unit testing with vue-test-utils.
  Vue.use(VueI18n);

  i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: require('../lang/en').default
    }
  });
}

export default i18n;
