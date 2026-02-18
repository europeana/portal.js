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

    created() {
      if (process.client) {
        this.$keycloak.login({ replace: true });
      }
    },

    mounted() {
      this.$keycloak.login({ replace: true });
    }
  };
</script>
