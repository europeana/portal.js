<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutPage',

    mounted() {
      this.$keycloak.logout({ replace: true });

      // TODO: is any of the below still relevant?
      // localStorage.setItem('logout-event', `logout-${Math.random()}`);

      // const path = this.$auth.strategies.keycloak.options.end_session_endpoint;
      // const redirect = window.location.origin + this.$auth.$storage.getUniversal('redirect');

      // window.location.assign(`${path}?redirect_uri=${encodeURIComponent(redirect)}`);
    }
  };
</script>
