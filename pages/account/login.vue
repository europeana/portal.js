<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    created() {
      this.$auth.loginWith('keycloak');
      this.$store.dispatch('status/login', true);
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$auth.$storage.setUniversal('redirect', from.fullPath);
      });
    }
  };
</script>
