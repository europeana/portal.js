<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountCallbackPage',
    auth: false,
    layout: 'minimal',
    mounted() {
      this.$store.commit('auth/setLoggedIn', this.$keycloak.auth.authenticated);
      this.$router.push('/');
    }
  };
</script>
