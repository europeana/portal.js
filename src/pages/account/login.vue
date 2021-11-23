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

    mounted() {
      this.keycloakLogin();
    }
  };
</script>
