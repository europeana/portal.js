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

      const redirectUrl = new URL(`${this.$config.app.baseUrl}/account/callback`);
      redirectUrl.searchParams.set('redirect', redirectPath);

      return redirectUrl.toString();
    },

    keycloakAccountUrl() {
      const keycloakAccountUrl = new URL(this.$config.keycloak.url);

      keycloakAccountUrl.pathname = `${keycloakAccountUrl.pathname}/realms/${this.$config.keycloak.realm}/account`;
      if (keycloakAccountUrl.pathname.startsWith('//')) {
        keycloakAccountUrl.pathname = keycloakAccountUrl.pathname.slice(1);
      }

      const referrerUri = new URL(this.$config.app.baseUrl);
      referrerUri.pathname = this.$route.path;
      referrerUri.search = new URLSearchParams(this.$route.query).toString();
      referrerUri.hash = this.$route.hash;

      keycloakAccountUrl.search = new URLSearchParams({
        referrer: this.$config.keycloak.clientId,
        'referrer_uri': referrerUri.toString()
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
