<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',
    mounted() {
      this.$auth.logout();
      const path = this.$auth.strategies.keycloak.options.end_session_endpoint;
      this.$goto(`${path}?redirect_uri=${encodeURIComponent(window.location.origin)}`);
    }
  };
  </script>
