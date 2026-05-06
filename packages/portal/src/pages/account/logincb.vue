<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginCallbackPage',

    layout: 'minimal',

    mounted() {
      // NOTE: in mounted because it relies on localStorage for OIDC state validation
      this.$keycloak.loginCallback();
    }
  };
</script>
