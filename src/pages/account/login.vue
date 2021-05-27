<template>
  <div />
</template>

<script>
  import keycloak from '../../mixins/keycloak';

  export default {
    layout: 'minimal',

    mixins: [
      keycloak
    ],

    mounted() {
      this.keycloakLogin();
    }
  };
</script>
