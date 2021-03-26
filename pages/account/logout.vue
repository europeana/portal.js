<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    created() {
      this.$auth.$storage.setUniversal('portalLoggingOut', true);
    },

    mounted() {
      this.$auth.logout();
      localStorage.setItem('logout-event', `logout-${Math.random()}`);

      const path = this.$auth.strategies.keycloak.options.end_session_endpoint;
      const redirect = window.location.origin + this.$auth.$storage.getUniversal('redirect');
      this.$goto(`${path}?redirect_uri=${encodeURIComponent(redirect)}`);
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        const redirectPath = /^account___[a-z]{2}$/.test(from.name) ? `/${vm.$i18n.locale}` : from.fullPath;
        vm.$auth.$storage.setUniversal('redirect', redirectPath);
      });
    }
  };
  </script>
