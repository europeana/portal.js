<template>
  <div
    data-qa="account page"
    class="mt-n3"
  >
    <b-container
      v-if="loggedInUser"
      fluid
    >
      <b-row class="bg-white">
        <b-col class="pt-5 pb-4">
          <h1 class="text-center mb-1">
            @{{ loggedInUser.preferred_username }}
          </h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-0">
          <b-tabs
            align="center"
          >
            <b-tab
              data-qa="likes collection"
              :title="$t('account.likes')"
              active
            >
              <!-- TODO: Update this section to preview the results retrieved with Sets API -->
              <div class="text-center p-3">
                Placeholder for {{ $t('account.likes') }} tab.
              </div>
            </b-tab>
            <b-tab
              data-qa="public collections"
              :title="$t('account.publicCollections')"
            >
              <!-- TODO: Update this section to preview the results retrieved with Sets API -->
              <div class="text-center p-3">
                Placeholder for {{ $t('account.publicCollections') }} tab.
              </div>
            </b-tab>
            <b-tab
              data-qa="private collections"
              :title="$t('account.privateCollections')"
            >
              <!-- TODO: Update this section to preview the results retrieved with Sets API -->
              <div class="text-center p-3">
                Placeholder for {{ $t('account.privateCollections') }} tab.
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    middleware: 'auth',

    computed: {
      loggedInUser() {
        return this.$store.state.auth.user;
      }
    },

    head() {
      return {
        title: this.$t('account.title')
      };
    }
  };

</script>
