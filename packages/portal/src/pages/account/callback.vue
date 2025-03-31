<template>
  <div />
</template>

<script>
  // Callback for both login and logout
  export default {
    name: 'AccountCallbackPage',

    mounted() {
      this.$keycloak.callback();
    }
  };
</script>
