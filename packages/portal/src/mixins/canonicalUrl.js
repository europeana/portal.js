export default {
  methods: {
    canonicalUrl({ locale = true, fullPath = true } = {}) {
      let path = fullPath ? this.$route.fullPath : this.$route.path;

      if (!locale) {
        if (this.$route.path === `/${this.$i18n.locale}`) {
          path = path.replace(this.$i18n.locale, '');
        } else if (path.startsWith(`/${this.$i18n.locale}/`)) {
          path = path.slice(3);
        }
      }

      return `${this.$config.app.baseUrl}${path}`;
    }
  }
};
