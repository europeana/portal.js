<template>
  <div />
</template>

<script>
  export default {
    auth: false,
    layout: 'minimal',
    created() {
      this.$auth.loginWith('keycloak');
    }
  };
</script>
