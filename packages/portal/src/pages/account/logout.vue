<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutPage',

    mounted() {
      this.$keycloak.logout();
    }
  };
</script>
