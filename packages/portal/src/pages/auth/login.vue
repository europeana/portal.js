<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    mounted() {
      this.$keycloak.login({ replace: true });
    }
  };
</script>
