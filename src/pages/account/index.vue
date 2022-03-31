<template>
  <div
    data-qa="account page"
    class="mt-n3"
  >
    <b-container fluid>
      <b-row class="bg-white">
        <b-col class="pt-5 pb-4">
          <h1 class="text-center">
            @{{ loggedInUser && loggedInUser.preferred_username }}
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
        <b-col class="p-0 mb-3">
          <b-nav
            tabs
            align="center"
          >
            <b-nav-item
              data-qa="likes collection"
              :to="$path({ hash: tabHashes.likes})"
              :active="activeTab === tabHashes.likes"
            >
              {{ $t('account.likes') }}
            </b-nav-item>
            <b-nav-item
              data-qa="public collections"
              :to="$path({ hash: tabHashes.publicGalleries})"
              :active="activeTab === tabHashes.publicGalleries"
            >
              {{ $t('account.publicCollections') }}
            </b-nav-item>
            <b-nav-item
              data-qa="private collections"
              :to="$path({ hash: tabHashes.privateGalleries})"
              :active="activeTab === tabHashes.privateGalleries"
            >
              {{ $t('account.privateCollections') }}
            </b-nav-item>
            <b-nav-item
              v-if="userIsEditor"
              data-qa="curated collections"
              :to="$path({ hash: tabHashes.curatedCollections})"
              :active="activeTab === tabHashes.curatedCollections"
            >
              {{ $t('account.curatedCollections') }}
            </b-nav-item>
          </b-nav>
          <client-only>
            <div
              v-if="$fetchState.pending"
              class="text-center pb-4"
            >
              <LoadingSpinner />
            </div>
            <AlertMessage
              v-else-if="$fetchState.error"
              :error="$fetchState.error.message"
            />
            <b-container
              v-else-if="activeTab === tabHashes.likes"
              data-qa="liked items"
            >
              <b-row class="flex-md-row">
                <b-col cols="12">
                  <template
                    v-if="likedItems"
                  >
                    <ItemPreviewCardGroup
                      v-if="likesId && likedItems.length !== 0"
                      :items="likedItems"
                      class="pb-5"
                    />
                    <div
                      v-else
                      class="text-center pb-4"
                    >
                      {{ $t('account.notifications.noLikedItems') }}
                    </div>
                  </template>
                </b-col>
              </b-row>
            </b-container>
            <template v-else-if="activeTab === tabHashes.publicGalleries">
              <UserSets
                :sets="publicCreations"
                visibility="public"
                :empty-text="$t('account.notifications.noCollections.public')"
                data-qa="public sets"
              />
            </template>
            <template v-else-if="activeTab === tabHashes.privateGalleries">
              <UserSets
                :sets="privateCreations"
                visibility="private"
                :empty-text="$t('account.notifications.noCollections.private')"
                data-qa="private sets"
              />
            </template>
            <template v-else-if="userIsEditor && activeTab === tabHashes.curatedCollections">
              <UserSets
                :sets="curations"
                :show-create-set-button="false"
                :empty-text="$t('account.notifications.noCollections.curated')"
                data-qa="curated sets"
              >
                <template slot="header">
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
            </template>
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { BNav } from 'bootstrap-vue';
  import { mapState } from 'vuex';

  import keycloak from '../../mixins/keycloak';
  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';
  import UserSets from '../../components/account/UserSets';
  import AlertMessage from '../../components/generic/AlertMessage';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';

  export default {
    name: 'AccountIndexPage',

    components: {
      BNav,
      ItemPreviewCardGroup,
      UserSets,
      AlertMessage,
      LoadingSpinner
    },

    mixins: [
      keycloak
    ],

    middleware: 'auth',

    data() {
      return {
        loggedInUser: this.$store.state.auth.user,
        tabHashes: {
          likes: '#likes',
          publicGalleries: '#public-galleries',
          privateGalleries: '#private-galleries',
          curatedCollections: '#curated-collections'
        }
      };
    },

    async fetch() {
      this.fetchLikes();
      await this.$store.dispatch('set/fetchCreations');
      if (this.userIsEditor) {
        await this.$store.dispatch('set/fetchCurations');
      }
    },

    fetchOnServer: false,

    head() {
      return {
        title: this.$pageHeadTitle(this.$t('account.title'))
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
      }),
      activeTab() {
        return this.$route.hash || this.tabHashes.likes;
      }
    },

    methods: {
      fetchLikes() {
        this.$store.dispatch('set/fetchLikes');
      }
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
