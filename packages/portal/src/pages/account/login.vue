<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    layout: 'minimal',

    mounted() {
      this.$keycloak.login({ replace: true });
    }
  };
</script>
