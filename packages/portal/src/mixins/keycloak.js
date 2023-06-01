export default {
  computed: {
    keycloakLoginRedirect() {
      let redirect = '/account';

      if (this.$route) {
        if (this.$route.query?.redirect) {
          redirect = this.$route.query.redirect;
        } else if (this.$route.path?.endsWith('/account/login')) {
          redirect = `/account${this.$route.hash || ''}`;
        } else if (this.$route.fullPath) {
          redirect = this.$route.fullPath;
        }
      }

      return redirect;
    },

    keycloakAccountUrl() {
      const keycloakAccountUrl = new URL(
        `/realms/${this.$config.keycloak.realm}/account`, this.$config.keycloak.url
      );
      keycloakAccountUrl.search = new URLSearchParams({
        referrer: this.$config.keycloak.clientId,
        'referrer_uri': this.$config.app.baseUrl
      }).toString();
      return keycloakAccountUrl.toString();
    }
  },

  methods: {
    keycloakLogin() {
      console.log('this.$keycloak', this.$keycloak);
      this.$keycloak?.login({
        locale: this.$i18n.locale,
        redirectUri: `${window.location.origin}${this.keycloakLoginRedirect}`
      });
      // this.$auth.$storage.setUniversal('redirect', this.keycloakLoginRedirect);
      // this.$auth.$storage.setUniversal('portalLoggingIn', true);
      // this.$auth.loginWith('keycloak', { params: { 'ui_locales': this.$i18n.locale } });
    }
  }
};
