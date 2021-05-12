export default {
  computed: {
    loginRedirect() {
      let redirect;
      if (this.$route) {
        if (this.$route.query && this.$route.query.redirect) {
          redirect = this.$route.query.redirect;
        } else if (this.$route.fullPath) {
          redirect = this.$route.fullPath;
        }
      }
      return redirect;
    }
  },
  methods: {
    login() {
      this.$auth.$storage.setUniversal('redirect', this.loginRedirect);
      this.$auth.$storage.setUniversal('portalLoggingIn', true);
      this.$auth.loginWith('keycloak', { params: { 'ui_locales': this.$i18n.locale } });
    }
  }
};
