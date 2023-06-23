<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountCallbackPage',

    layout: 'minimal',

    mounted() {
      this.$store.commit('keycloak/setLoggedIn', this.$keycloak.auth.authenticated);
      this.$router.push(this.$route.query.redirect?.startsWith('/') ? this.$route.query.redirect : '/account');
    }
  };
</script>
