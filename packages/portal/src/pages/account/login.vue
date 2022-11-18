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

    middleware: [
      'cache-control-private'
    ],

    layout: 'minimal',

    mounted() {
      this.keycloakLogin();
    }
  };
</script>
