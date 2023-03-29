export default {
  computed: {
    canonicalUrl() {
      return this.$config.app.baseUrl + this.$route.fullPath;
    },
    canonicalUrlWithoutLocale() {
      // TODO: get rid of regex
      return this.canonicalUrl.replace(/(:\/\/[^/]+)\/[a-z]{2}(\/|$)/, '$1$2');
    }
  }
};
