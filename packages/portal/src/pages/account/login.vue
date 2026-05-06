<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    layout: 'minimal',

    mounted() {
      localStorage.setItem('portalLoggingIn', true);
      this.$keycloak.login({ replace: true });
    }
  };
</script>
