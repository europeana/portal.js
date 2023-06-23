<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutPage',

    layout: 'minimal',

    mounted() {
      this.$keycloak.logout();
    }
  };
</script>
