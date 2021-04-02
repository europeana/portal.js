<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    created() {
      this.$auth.$storage.setUniversal('portalLoggingIn', true);
      this.$auth.loginWith('keycloak');
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$auth.$storage.setUniversal('redirect', from.fullPath);
      });
    }
  };
</script>
