<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    mounted() {
      this.$auth.logout();
      localStorage.setItem('logout-event', `logout-${Math.random()}`);

      const path = this.$auth.strategies.keycloak.options.end_session_endpoint;
      const redirect = window.location.origin + this.$auth.$storage.getUniversal('redirect');
      this.$goto(`${path}?redirect_uri=${encodeURIComponent(redirect)}`);
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$auth.$storage.setUniversal('redirect', from.fullPath);
      });
    }
  };
  </script>
