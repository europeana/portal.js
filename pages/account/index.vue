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
              <b-container>
                <b-row class="flex-md-row pb-5">
                  <b-col cols="12">
                    <ItemPreviewCardGroup
                      v-model="likes"
                      @unlike="fetchLikes()"
                    />
                  </b-col>
                </b-row>
              </b-container>
            </b-tab>
            <b-tab
              data-qa="public collections"
              :title="$t('account.publicCollections')"
            >
              <div
                v-if="!$fetchState.pending"
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
  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';
  import UserSets from '../../components/account/UserSets';

  export default {
    middleware: 'auth',

    components: {
      ItemPreviewCardGroup,
      UserSets
    },

    async fetch() {
      await this.fetchLikes();
      this.publicSets = await this.$sets.getSetsByCreator(this.$auth.user.sub, 'public', 'minimal');
      this.privateSets = await this.$sets.getSetsByCreator(this.$auth.user.sub, 'private', 'minimal');
    },

    fetchOnServer: false,

    data() {
      return {
        loggedInUser: this.$store.state.auth.user,
        likes: [],
        publicSets: [],
        privateSets: []
      };
    },

    methods: {
      // TODO: pagination
      async fetchLikes() {
        const likes = await this.$sets.getSet(this.$store.state.set.likesId, {
          pageSize: 100
        }, true);
        this.likes = likes.items;
      }
    },

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
