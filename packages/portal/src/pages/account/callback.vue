<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountCallbackPage',
    auth: false,
    layout: 'minimal',
    mounted() {
      this.$store.commit('auth/setLoggedIn', this.$keycloak.authenticated);
      this.$router.push('/');
    }
  };
</script>
