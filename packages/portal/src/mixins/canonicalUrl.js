export default {
  methods: {
    canonicalUrl({ fullPath = true, locale = true, route = null } = {}) {
      route = route || this.$route;
      let path = fullPath ? route.fullPath : route.path;

      if (!locale) {
        if (route.path === `/${this.$i18n.locale}`) {
          path = path.replace(this.$i18n.locale, '');
        } else if (path.startsWith(`/${this.$i18n.locale}/`)) {
          path = path.slice(3);
        }
      }

      return `${this.$config.app.baseUrl}${path}`;
    }
  }
};
