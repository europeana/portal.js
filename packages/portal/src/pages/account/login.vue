<template>
  <div />
</template>

<script>
  import keycloak from '../../mixins/keycloak';

  export default {
    name: 'AccountLoginPage',

    mixins: [
      keycloak
    ],

    layout: 'minimal',

    middleware: [
      'cache-control-private'
    ],

    mounted() {
      this.keycloakLogin();
    }
  };
</script>
