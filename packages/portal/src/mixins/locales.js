export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale);
    },

    selectedLocale() {
      return this.$i18n.locales.find(locale => {
        return locale.code === this.$i18n.locale;
      });
    }
  }
};
