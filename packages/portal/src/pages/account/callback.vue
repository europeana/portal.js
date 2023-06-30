<template>
  <div />
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';

  // Callback for both login and logout
  export default {
    name: 'AccountCallbackPage',

    mixins: [
      makeToastMixin
    ],

    mounted() {
      // Notify of login/logout
      if (this.$store.state.keycloak.loggedIn) {
        this.makeToast(this.$t('account.notifications.loggedIn'));
      } else {
        this.makeToast(this.$t('account.notifications.loggedOut'));
      }

      this.$keycloak.callback();
    }
  };
</script>
