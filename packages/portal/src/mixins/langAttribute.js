export default {
  methods: {
    langAttribute(lang) {
      return (lang === this.$i18n?.locale) ? null : lang;
    }
  }
};
