<template>
  <div
    data-qa="account page"
    class="mt-n3"
  >
    <b-container fluid>
      <b-row class="bg-white">
        <b-col class="pt-5 pb-4">
          <h1 class="text-center">
            @{{ loggedInUser.preferred_username }}
          </h1>
          <div class="text-center">
            <b-button
              variant="outline-primary"
              class="mr-1 text-decoration-none"
              :href="keycloakAccountUrl"
            >
              {{ $t('account.editProfile') }}
            </b-button>
            <b-button
              to="/account/logout"
              variant="outline-primary"
              class="text-decoration-none"
            >
              {{ $t('account.linkLogout') }}
            </b-button>
          </div>
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
              <client-only>
                <b-container>
                  <b-row class="flex-md-row">
                    <b-col cols="12">
                      <template
                        v-if="likedItems"
                      >
                        <ItemPreviewCardGroup
                          v-if="likesId && likedItems.length !== 0"
                          v-model="likedItems"
                          class="pb-5"
                        />
                        <div
                          v-else
                          class="text-center pb-4"
                        >
                          {{ $t('account.notifications.noLikedItems') }}
                        </div>
                      </template>
                      <div
                        v-else-if="$fetchState.pending"
                        class="text-center pb-4"
                      >
                        <LoadingSpinner />
                      </div>
                      <AlertMessage
                        v-else-if="$fetchState.error"
                        :error="$fetchState.error.message"
                      />
                    </b-col>
                  </b-row>
                </b-container>
              </client-only>
            </b-tab>
            <b-tab
              data-qa="public collections"
              :title="$t('account.publicCollections')"
            >
              <client-only>
                <div
                  v-if="$fetchState.pending"
                  class="text-center pb-4"
                >
                  <LoadingSpinner />
                </div>
                <UserSets
                  v-else
                  v-model="publicCreations"
                  visibility="public"
                  :empty-text="$t('account.notifications.noCollections.public')"
                  data-qa="public sets"
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
                  class="text-center pb-4"
                >
                  <LoadingSpinner />
                </div>
                <UserSets
                  v-else
                  v-model="privateCreations"
                  visibility="private"
                  :empty-text="$t('account.notifications.noCollections.private')"
                  data-qa="private sets"
                />
              </client-only>
            </b-tab>
            <b-tab
              v-if="userIsEditor"
              data-qa="curated collections"
              :title="$t('account.curatedCollections')"
            >
              <client-only>
                <div
                  v-if="$fetchState.pending"
                  class="text-center pb-4"
                >
                  <LoadingSpinner />
                </div>
                <UserSets
                  v-else
                  v-model="curations"
                  :show-create-set-button="false"
                  :empty-text="$t('account.notifications.noCollections.curated')"
                  data-qa="curated sets"
                >
                  <template v-slot:header>
                    <b-row
                      class="w-100 px-3"
                    >
                      <b-col class="related-heading d-inline-flex px-0">
                        <span class="icon-info mr-1" />
                        <h2 class="related-heading text-uppercase">
                          {{ $t('account.curatedCollectionsInfo') }}
                        </h2>
                      </b-col>
                    </b-row>
                  </template>
                </UserSets>
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

  import keycloak from '../../mixins/keycloak';
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

    mixins: [
      keycloak
    ],

    async fetch() {
      this.fetchLikes();
      await this.$store.dispatch('set/fetchCreations');
      if (this.userIsEditor) {
        await this.$store.dispatch('set/fetchCurations');
      }
    },

    fetchOnServer: false,

    data() {
      return {
        loggedInUser: this.$store.state.auth.user
      };
    },

    computed: {
      userIsEditor() {
        return this.loggedInUser?.resource_access?.entities?.roles?.includes('editor') &&
          this.loggedInUser?.resource_access?.usersets?.roles?.includes('editor');
      },
      ...mapState({
        likesId: state => state.set.likesId,
        likedItems: state => state.set.likedItems,
        curations: state => state.set.curations,
        publicCreations: state => state.set.creations.filter(set => set.visibility === 'public'),
        privateCreations: state => state.set.creations.filter(set => set.visibility === 'private')
      })
    },

    methods: {
      fetchLikes() {
        this.$store.dispatch('set/fetchLikes');
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.$t('account.title'))
      };
    }
  };

</script>

<style>
  h1 {
    margin-bottom: 0.75rem;
  }

  .nav-tabs {
    margin-bottom: 40px;
  }
</style>
