<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    layout: 'minimal',

    middleware: [
      'cache-control-private'
    ],

    mounted() {
      this.$keycloak.login();
    }
  };
</script>
