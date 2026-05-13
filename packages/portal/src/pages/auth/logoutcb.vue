<template>
  <div />
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'AccountLogoutCallbackPage',

    setup() {
      const { makeToast } = useMakeToast();

      return { makeToast };
    },

    async mounted() {
      // NOTE: in mounted so that it clears the cookies from the browser
      await this.$auth.logoutCallback();

      if (!this.$auth.user.loggedIn) {
        this.makeToast(this.$t('account.notifications.loggedOut'));
      }
    }
  };
</script>
