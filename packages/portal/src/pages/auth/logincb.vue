<template>
  <div />
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'AccountLoginCallbackPage',

    setup() {
      const { makeToast } = useMakeToast();

      return { makeToast };
    },

    async mounted() {
      // NOTE: in mounted because it relies on localStorage for OIDC state validation
      await this.$auth.loginCallback();

      if (this.$auth.loggedIn) {
        this.makeToast(this.$t('account.notifications.loggedIn'));
      }
    }
  };
</script>
