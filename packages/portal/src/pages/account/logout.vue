<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLogoutPage',

    beforeRouteEnter(to, from, next) {
      next(vm => {
        const redirectPath = /^account___[a-z]{2}$/.test(from.name) ? `/${vm.$i18n.locale}` : from.fullPath;
        vm.$auth.$storage.setUniversal('redirect', redirectPath);
      });
    },

    layout: 'minimal',

    created() {
      this.$auth.$storage.setUniversal('portalLoggingOut', true);
    },

    mounted() {
      this.$auth.logout({ params: { 'ui_locales': this.$i18n.locale } });

      const redirect = this.$auth.$storage.getUniversal('redirect');
      this.$router.push(redirect);
    }
  };
</script>
