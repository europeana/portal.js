<template>
  <div />
</template>

<script>
  export default {
    layout: 'minimal',

    data() {
      return {
        fromPortal: true
      };
    },

    mounted() {
      if (this.fromPortal) {
        this.$auth.$storage.setUniversal('portalLoggingIn', true);
        this.$auth.loginWith('keycloak');
      } else {
        const redirect = window.location.origin + this.$auth.$storage.getUniversal('redirect');
        this.$goto(redirect);
      }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name) {
          vm.$auth.$storage.setUniversal('redirect', from.fullPath);
        } else {
          vm.fromPortal = false;
        }
      });
    }
  };
</script>
