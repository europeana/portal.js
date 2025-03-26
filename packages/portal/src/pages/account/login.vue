<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    layout: 'minimal',

    mounted() {
      localStorage['kc.login'] = 'true';
      this.$keycloak.login();
    }
  };
</script>
