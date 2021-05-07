<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    created() {
      this.$auth.$storage.setUniversal('portalLoggingIn', true);
      this.$auth.loginWith('keycloak', {
        params: {
          'referrer_uri': this.$config.app.baseUrl,
          'ui_locales': this.$i18n.locale
        }
      });
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$auth.$storage.setUniversal('redirect', from.fullPath);
      });
    }
  };
</script>
