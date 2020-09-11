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
                <b-row class="flex-md-row">
                  <b-col cols="12">
                    <div
                      v-if="likedItems && likedItems.length === 0"
                      class="tab-info likes"
                    >
                      <LoadingSpinner />
                    </div>
                    <AlertMessage
                      v-else-if="$fetchState.error"
                      :error="$fetchState.error.message"
                    />
                    <template v-else>
                      <div
                        v-if="!likedItems"
                        class="tab-info likes"
                      >
                        {{ $t('account.notifications.noLikedItems') }}
                      </div>
                      <ItemPreviewCardGroup
                        v-else
                        v-model="likedItems"
                        class="pb-5"
                      />
                    </template>
                  </b-col>
                </b-row>
              </b-container>
            </b-tab>
            <b-tab
              data-qa="public collections"
              :title="$t('account.publicCollections')"
            >
              <client-only>
                <div
                  v-if="$fetchState.pending"
                  class="tab-info likes"
                >
                  <LoadingSpinner />
                </div>
                <UserSets
                  v-else
                  visibility="public"
                  data-qa="public sets"
                  class="pt-4"
                />
              </client-only>
            </b-tab>
            <b-tab
              data-qa="private collections"
              :title="$t('account.privateCollections')"
            >
              <client-only>
                <div
                  v-if="$fetchState.pending"
                  class="tab-info likes"
                >
                  <LoadingSpinner />
                </div>
                <UserSets
                  v-else
                  visibility="private"
                  data-qa="private sets"
                  class="pt-4"
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
  import { mapState } from 'vuex';

  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';
  import UserSets from '../../components/account/UserSets';
  import AlertMessage from '../../components/generic/AlertMessage';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';

  export default {
    middleware: 'auth',

    components: {
      ItemPreviewCardGroup,
      UserSets,
      AlertMessage,
      LoadingSpinner
    },

    async fetch() {
      this.fetchLikes();
      await this.$store.dispatch('set/fetchCreations');
    },

    fetchOnServer: false,

    data() {
      return {
        loggedInUser: this.$store.state.auth.user
      };
    },

    computed: {
      ...mapState({
        likesId: state => state.set.likesId,
        likedItems: state => state.set.likedItems
      })
    },

    watch: {
      likesId: 'fetchLikes'
    },

    methods: {
      fetchLikes() {
        this.$store.dispatch('set/fetchLikes');
      }
    },

    head() {
      return {
        title: this.$t('account.title')
      };
    }
  };

</script>

<style lang="scss" scoped>
  /deep/ .tab-content {
    min-height: 318px;
    margin-top: 1rem;
  }
  /deep/ .tab-info {
    position: relative;
    text-align: center;
    &.likes {
      top: 135px;
    }
    &.collections {
      top: 111px;
    }
  }
</style>
