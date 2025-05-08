<template>
  <div
    data-qa="account page"
    class="xxl-page page"
  >
    <b-container fluid>
      <UserHeader />
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
                  :to="localePath({ hash: HASH_LIKES})"
                  :active="activeTabHash === HASH_LIKES"
                >
                  {{ $t('account.likes') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="public collections"
                  :to="localePath({ hash: HASH_PUBLIC_GALLERIES})"
                  :active="activeTabHash === HASH_PUBLIC_GALLERIES"
                >
                  {{ $t('account.publicCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="private collections"
                  :to="localePath({ hash: HASH_PRIVATE_GALLERIES})"
                  :active="activeTabHash === HASH_PRIVATE_GALLERIES"
                >
                  {{ $t('account.privateCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="published collections"
                  :to="localePath({ hash: HASH_PUBLISHED_GALLERIES})"
                  :active="activeTabHash === HASH_PUBLISHED_GALLERIES"
                >
                  {{ $t('account.publishedCollections') }}
                </b-nav-item>
                <b-nav-item
                  v-if="userIsEditor"
                  data-qa="curated collections"
                  :to="localePath({ hash: HASH_CURATED_COLLECTIONS})"
                  :active="activeTabHash === HASH_CURATED_COLLECTIONS"
                >
                  {{ $t('account.curatedCollections') }}
                </b-nav-item>
              </b-nav>
            </b-row>
          </b-container>
          <client-only>
            <AlertMessage
              v-if="$fetchState.error"
              :error="$fetchState.error.message"
            />
            <template
              v-else-if="activeTabHash === HASH_LIKES"
            >
              <ItemPreviewInterface
                data-qa="liked items"
                :enable-item-multi-select="true"
                :loading="$fetchState.pending"
                :items="likedItems"
                :per-page="100"
                :max-results="100"
                :total="likedItems?.length || 0"
              >
                <template #no-items>
                  <div
                    class="text-center pb-4"
                  >
                    {{ $t('account.notifications.noLikedItems') }}
                  </div>
                </template>
              </ItemPreviewInterface>
            </template>
            <template v-else-if="activeTabHash === HASH_PUBLIC_GALLERIES">
              <UserSets
                visibility="public"
                :empty-text="$t('account.notifications.noCollections.public')"
                data-qa="public sets"
              />
            </template>
            <template v-else-if="activeTabHash === HASH_PRIVATE_GALLERIES">
              <UserSets
                visibility="private"
                :empty-text="$t('account.notifications.noCollections.private')"
                data-qa="private sets"
              />
            </template>
            <template v-else-if="activeTabHash === HASH_PUBLISHED_GALLERIES">
              <UserSets
                visibility="published"
                :show-create-set-button="false"
                :empty-text="$t('account.notifications.noCollections.published')"
                data-qa="published sets"
              />
            </template>
            <template v-else-if="userIsEditor && activeTabHash === HASH_CURATED_COLLECTIONS">
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
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BNav, BNavItem } from 'bootstrap-vue';
  import { mapState } from 'vuex';

  import pageMetaMixin from '@/mixins/pageMeta';
  import AlertMessage from '@/components/generic/AlertMessage';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import UserHeader from '@/components/user/UserHeader';
  import UserSets from '@/components/user/UserSets';
  import useActiveTab from '@/composables/activeTab.js';

  const HASH_CURATED_COLLECTIONS = '#curated-collections';
  const HASH_LIKES = '#likes';
  const HASH_PRIVATE_GALLERIES = '#private-galleries';
  const HASH_PUBLIC_GALLERIES = '#public-galleries';
  const HASH_PUBLISHED_GALLERIES = '#published-galleries';

  export default {
    name: 'AccountIndexPage',

    components: {
      AlertMessage,
      BNav,
      BNavItem,
      ClientOnly,
      ItemPreviewInterface,
      UserHeader,
      UserSets
    },

    mixins: [
      pageMetaMixin
    ],

    beforeRouteLeave(_to, _from, next) {
      this.$store.commit('set/setSelected', []);
      next();
    },

    middleware: 'auth',

    setup() {
      const tabHashes = [
        HASH_LIKES,
        HASH_PUBLIC_GALLERIES,
        HASH_PRIVATE_GALLERIES,
        HASH_PUBLISHED_GALLERIES,
        HASH_CURATED_COLLECTIONS
      ];

      const { activeTabHash, activeTabIndex, watchTabIndex, unwatchTabIndex } = useActiveTab(tabHashes, { replaceRoute: false });

      return {
        activeTabHash,
        activeTabIndex,
        watchTabIndex,
        unwatchTabIndex
      };
    },

    data() {
      return {
        HASH_CURATED_COLLECTIONS,
        HASH_LIKES,
        HASH_PRIVATE_GALLERIES,
        HASH_PUBLIC_GALLERIES,
        HASH_PUBLISHED_GALLERIES,
        tabFocused: false
      };
    },

    fetch() {
      this.fetchLikes();
    },

    fetchOnServer: false,

    computed: {
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
      })
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

  .nav-tabs {
    margin-bottom: 2.5rem;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(1.5 * 2.5rem);
    }
  }

  .tab-content:focus {
    outline: none;
  }
</style>
