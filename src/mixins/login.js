export default {
  methods: {
    login() {
      this.$auth.$storage.setUniversal('redirect', this.$route.fullPath);
      this.$auth.$storage.setUniversal('portalLoggingIn', true);
      this.$auth.loginWith('keycloak');
    }
  }
};
