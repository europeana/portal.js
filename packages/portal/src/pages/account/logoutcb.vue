<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutCallbackPage',

    layout: 'minimal',

    mounted() {
      // NOTE: in mounted so that it clears the cookies from the browser
      this.$keycloak.logoutCallback();
    }
  };
</script>
