<template>
  <b-row>
    <b-col class="d-flex justify-content-center align-items-center pb-4">
      <h1 class="text-center mb-0 text-break">
        @{{ loggedInUser?.preferred_username }}
      </h1>
      <UserProfileDropdown />
    </b-col>
  </b-row>
</template>

<script>
  import UserProfileDropdown from './UserProfileDropdown';

  export default {
    name: 'UserHeader',

    components: {
      UserProfileDropdown
    },

    data() {
      return {
        loggedInUser: this.$store?.state?.auth?.user
      };
    }
  };
</script>
