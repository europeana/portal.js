<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutPage',

    layout: 'minimal',

    mounted() {
      localStorage['kc.logout'] = 'true';
      this.$keycloak.logout();
    }
  };
</script>
