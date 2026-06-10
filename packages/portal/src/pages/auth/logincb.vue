<template>
  <div />
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'AuthLoginCallbackPage',

    setup() {
      const { makeToast } = useMakeToast();

      return { makeToast };
    },

    async mounted() {
      // NOTE: in mounted because it relies on localStorage for OIDC state validation
      this.$auth.login.callback(async() => {
        await this.$likedItems.initSetId();
        this.makeToast(this.$t('account.notifications.loggedIn'));
      });
    }
  };
</script>
