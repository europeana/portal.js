// TODO: move to keycloak plugin?
export default {
  computed: {
    keycloakLoginRedirect() {
      let redirectPath = '/account';

      if (this.$route) {
        if (this.$route.query?.redirect) {
          redirectPath = this.$route.query.redirect;
        } else if (this.$route.path?.endsWith('/account/login')) {
          redirectPath = `/account${this.$route.hash || ''}`;
        } else if (this.$route.fullPath) {
          redirectPath = this.$route.fullPath;
        }
      }

      const redirectUrl = new URL(`${window.location.origin}/account/callback`);
      redirectUrl.searchParams.set('redirect', redirectPath);
      return redirectUrl.toString();
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
      this.$keycloak.auth?.login({
        locale: this.$i18n.locale,
        redirectUri: this.keycloakLoginRedirect
      });
      // this.$auth.$storage.setUniversal('redirect', this.keycloakLoginRedirect);
      // this.$auth.$storage.setUniversal('portalLoggingIn', true);
      // this.$auth.loginWith('keycloak', { params: { 'ui_locales': this.$i18n.locale } });
    }
  }
};
