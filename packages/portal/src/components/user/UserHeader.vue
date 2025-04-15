<template>
  <b-row>
    <b-col class="pb-4">
      <h1 class="text-center">
        @{{ loggedInUser?.preferred_username }}
      </h1>
      <div class="text-center">
        <b-button
          class="mr-1 text-decoration-none d-inline-flex align-items-center"
          :href="editProfileUrl"
          data-qa="edit profile button"
        >
          <span class="icon-edit pr-1" />
          {{ $t('account.editProfile') }}
        </b-button>
        <b-button
          to="/account/logout"
          class="text-decoration-none"
          data-qa="logout button"
        >
          {{ $t('account.linkLogout') }}
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'UserHeader',

    data() {
      return {
        loggedInUser: this.$store?.state?.auth?.user
      };
    },

    computed: {
      editProfileUrl() {
        return this.$keycloak?.accountUrl();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  h1 {
    margin-bottom: 0.75rem;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(1.5 * 0.75rem);
    }
  }
</style>
