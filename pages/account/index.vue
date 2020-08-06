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
              <div
                v-if="!$fetchState.pending"
                class="pt-4"
              >
                <client-only>
                  <UserSets
                    v-if="publicSets"
                    :set-ids="publicSets"
                    data-qa="public sets"
                  />
                </client-only>
              </div>
            </b-tab>
            <b-tab
              data-qa="private collections"
              :title="$t('account.privateCollections')"
            >
              <div
                v-if="!$fetchState.pending"
                class="pt-4"
              >
                <client-only>
                  <UserSets
                    v-if="privateSets"
                    :set-ids="privateSets"
                    data-qa="private sets"
                  />
                </client-only>
              </div>
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
    async fetch() {
      this.publicSets = await this.$sets.getSetsByCreator(this.$auth.user.sub, 'public', 'minimal');
      this.privateSets = await this.$sets.getSetsByCreator(this.$auth.user.sub, 'private', 'minimal');
    },
    data() {
      return {
        loggedInUser: this.$store.state.auth.user,
        publicSets: [],
        privateSets: []
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
