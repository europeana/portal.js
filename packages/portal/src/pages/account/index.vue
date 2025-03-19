<template>
  <div
    data-qa="account page"
    class="xxl-page page"
  >
    <b-container fluid>
      <b-row>
        <b-col class="pb-4">
          <h1 class="text-center">
            @{{ loggedInUser && loggedInUser.preferred_username }}
          </h1>
          <div class="text-center">
            <b-button
              class="mr-1 text-decoration-none d-inline-flex align-items-center"
              :href="editProfileUrl"
            >
              <span class="icon-edit pr-1" />
              {{ $t('account.editProfile') }}
            </b-button>
            <b-button
              to="/account/logout"
              class="text-decoration-none"
            >
              {{ $t('account.linkLogout') }}
            </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-0 mb-3">
          <b-container>
            <b-row>
              <b-nav
                tabs
                align="center"
                class="w-100"
              >
                <b-nav-item
                  data-qa="likes collection"
                  :to="localePath({ hash: tabHashes.likes})"
                  :active="activeTab === tabHashes.likes"
                >
                  {{ $t('account.likes') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="public collections"
                  :to="localePath({ hash: tabHashes.publicGalleries})"
                  :active="activeTab === tabHashes.publicGalleries"
                >
                  {{ $t('account.publicCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="private collections"
                  :to="localePath({ hash: tabHashes.privateGalleries})"
                  :active="activeTab === tabHashes.privateGalleries"
                >
                  {{ $t('account.privateCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="published collections"
                  :to="localePath({ hash: tabHashes.publishedGalleries})"
                  :active="activeTab === tabHashes.publishedGalleries"
                >
                  {{ $t('account.publishedCollections') }}
                </b-nav-item>
                <b-nav-item
                  v-if="userIsEditor"
                  data-qa="curated collections"
                  :to="localePath({ hash: tabHashes.curatedCollections})"
                  :active="activeTab === tabHashes.curatedCollections"
                >
                  {{ $t('account.curatedCollections') }}
                </b-nav-item>
              </b-nav>
            </b-row>
          </b-container>
          <client-only>
            <LoadingSpinner
              v-if="$fetchState.pending"
              class="text-center pb-4"
            />
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
                    <b-row
                      v-if="likedItems.length > 0"
                    >
                      <b-col class="d-flex align-items-center mb-3">
                        <h2
                          class="related-heading text-uppercase mb-0"
                        >
                          {{ $tc('items.itemCount', likedItems.length) }}
                        </h2>
                        <ItemSelectButton
                          v-if="$features.itemMultiSelect"
                          class="ml-auto"
                          @select="(newState) => selectState = newState"
                        />
                        <SearchViewToggles
                          v-model="view"
                          :class="{ 'ml-auto': !$features.itemMultiSelect }"
                        />
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="12">
                        <ItemPreviewCardGroup
                          v-if="likesId && likedItems.length !== 0"
                          :items="likedItems"
                          :view="view"
                          :select-state="selectState"
                          class="pb-5"
                        />
                      </b-col>
                    </b-row>
                  </template>
                  <div
                    v-else
                    class="text-center pb-4"
                  >
                    {{ $t('account.notifications.noLikedItems') }}
                  </div>
                </b-col>
              </b-row>
            </b-container>
            <template v-else-if="activeTab === tabHashes.publicGalleries">
              <UserSets
                visibility="public"
                :empty-text="$t('account.notifications.noCollections.public')"
                data-qa="public sets"
              />
            </template>
            <template v-else-if="activeTab === tabHashes.privateGalleries">
              <UserSets
                visibility="private"
                :empty-text="$t('account.notifications.noCollections.private')"
                data-qa="private sets"
              />
            </template>
            <template v-else-if="activeTab === tabHashes.publishedGalleries">
              <UserSets
                visibility="published"
                :show-create-set-button="false"
                :empty-text="$t('account.notifications.noCollections.published')"
                data-qa="published sets"
              />
            </template>
            <template v-else-if="userIsEditor && activeTab === tabHashes.curatedCollections">
              <UserSets
                type="EntityBestItemsSet"
                :show-create-set-button="false"
                :empty-text="$t('account.notifications.noCollections.curated')"
                data-qa="curated sets"
              />
            </template>
          </client-only>
        </b-col>
      </b-row>
    </b-container>
    <ItemSelectToolbar
      v-if="selectState"
      :user-can-edit-set="userCanEditSet"
    />
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BNav } from 'bootstrap-vue';
  import { mapState } from 'vuex';

  import itemPreviewCardGroupViewMixin from '@/mixins/europeana/item/itemPreviewCardGroupView';
  import pageMetaMixin from '@/mixins/pageMeta';
  import AlertMessage from '@/components/generic/AlertMessage';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import ItemSelectButton from '@/components/item/ItemSelectButton';
  import ItemSelectToolbar from '@/components/item/ItemSelectToolbar';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import SearchViewToggles from '@/components/search/SearchViewToggles';
  import UserSets from '@/components/user/UserSets';

  export default {
    name: 'AccountIndexPage',

    components: {
      AlertMessage,
      BNav,
      ClientOnly,
      ItemPreviewCardGroup,
      ItemSelectButton,
      ItemSelectToolbar,
      LoadingSpinner,
      SearchViewToggles,
      UserSets
    },

    mixins: [
      itemPreviewCardGroupViewMixin,
      pageMetaMixin
    ],

    middleware: 'auth',

    data() {
      return {
        loggedInUser: this.$store.state.auth.user,
        selectState: false,
        tabHashes: {
          likes: '#likes',
          publicGalleries: '#public-galleries',
          privateGalleries: '#private-galleries',
          publishedGalleries: '#published-galleries',
          curatedCollections: '#curated-collections'
        }
      };
    },

    async fetch() {
      this.fetchLikes();
    },

    fetchOnServer: false,

    computed: {
      editProfileUrl() {
        return this.$keycloak.accountUrl();
      },
      pageMeta() {
        return {
          title: this.$t('account.title')
        };
      },
      userIsEditor() {
        return this.$auth.userHasClientRole('entities', 'editor') &&
          this.$auth.userHasClientRole('usersets', 'editor');
      },
      ...mapState({
        likesId: state => state.set.likesId,
        likedItems: state => state.set.likedItems,
        curations: state => state.set.curations
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

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/tabs';

  h1 {
    margin-bottom: 0.75rem;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(1.5 * 0.75rem);
    }
  }

  .nav-tabs {
    margin-bottom: 2.5rem;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(1.5 * 2.5rem);
    }
  }
</style>
