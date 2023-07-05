<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    mounted() {
      console.log('account login page mounted')
      this.$keycloak.login();
    }
  };
</script>
