export default {
  computed: {
    canonicalUrl() {
      return this.$config.app.baseUrl + this.$route.fullPath;
    },
    canonicalUrlWithoutLocale() {
      if (this.$route.path === `/${this.$i18n.locale}`) {
        return `${this.$config.app.baseUrl}/` + this.$route.fullPath.slice(3);
      } else if (this.$route.path.startsWith(`/${this.$i18n.locale}/`)) {
        return this.$config.app.baseUrl + this.$route.fullPath.slice(3);
      }
      return this.canonicalUrl;
    }
  }
};
