<template>
  <div
    data-qa="account page"
    class="mt-n3"
  >
    <b-container fluid>
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
            class="mb-3"
          >
            <b-tab
              data-qa="likes collection"
              :title="$t('account.likes')"
              active
            >
              <!-- TODO: Update this section to preview the results retrieved with Sets API -->
              <div class="text-center">
                Placeholder for {{ $t('account.likes') }} tab.
              </div>
            </b-tab>
            <b-tab
              data-qa="public collections"
              :title="$t('account.publicCollections')"
            >
              <client-only>
                <UserSets
                  visibility="public"
                  data-qa="public sets"
                />
              </client-only>
            </b-tab>
            <b-tab
              data-qa="private collections"
              :title="$t('account.privateCollections')"
            >
              <client-only>
                <UserSets
                  visibility="private"
                  data-qa="private sets"
                />
              </client-only>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import UserSets from '../../components/account/UserSets';
  export default {
    middleware: 'auth',
    components: {
      UserSets
    },
    data() {
      return {
        loggedInUser: this.$store.state.auth.user
      };
    },
    fetchOnServer: false,
    head() {
      return {
        title: this.$t('account.title')
      };
    }
  };

</script>

<style>
  .nav-tabs {
    margin-bottom: 40px;
  }
</style>
