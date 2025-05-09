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
            <AlertMessage
              v-if="$fetchState.error"
              :error="$fetchState.error.message"
            />
            <template
              v-else-if="activeTab === tabHashes.likes"
            >
              <ItemPreviewInterface
                id="account-page-liked-items"
                data-qa="liked items"
                :enable-item-multi-select="true"
                :loading="$fetchState.pending"
                :items="likedItems"
                :per-page="likedItemsPerPage"
                :total="likedItemsTotal"
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
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BNav } from 'bootstrap-vue';

  import pageMetaMixin from '@/mixins/pageMeta';
  import AlertMessage from '@/components/generic/AlertMessage';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import UserHeader from '@/components/user/UserHeader';
  import UserSets from '@/components/user/UserSets';
  import { useLikedItems } from '@/composables/likedItems.js';
  import useScrollTo from '@/composables/scrollTo.js';

  export default {
    name: 'AccountIndexPage',

    components: {
      AlertMessage,
      BNav,
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
      const { scrollToSelector } = useScrollTo();
      const setups = { scrollToSelector };

      if (process.client) {
        const { eventBus } = useLikedItems();
        setups.eventBus = eventBus;
      }

      return setups;
    },

    data() {
      return {
        likedItems: [],
        likedItemsPerPage: 24,
        likedItemsTotal: 0,
        tabHashes: {
          likes: '#likes',
          publicGalleries: '#public-galleries',
          privateGalleries: '#private-galleries',
          publishedGalleries: '#published-galleries',
          curatedCollections: '#curated-collections'
        }
      };
    },

    fetch() {
      if (this.activeTab === this.tabHashes.likes) {
        this.fetchLikes();
        this.scrollToSelector('#account-page-liked-items');
      }
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
      activeTab() {
        return this.$route.hash || this.tabHashes.likes;
      }
    },

    watch: {
      '$route.query.page': '$fetch'
    },

    mounted() {
      this.eventBus?.on(this.eventBusListener);
    },

    beforeDestroy() {
      this.eventBus?.off(this.eventBusListener);
    },

    methods: {
      eventBusListener() {
        this.fetchLikes();
      },

      async fetchLikes() {
        if (!this.$store.state.set.likesId) {
          return {};
        }

        try {
          const response = await this.$apis.set.get(this.$store.state.set.likesId, {
            page: Number(this.$route.query.page || 1),
            pageSize: this.likedItemsPerPage,
            profile: 'items.meta'
          });
          this.likedItems = response.items || [];
          this.likedItemsTotal = response.partOf.total;
        } catch {
          this.likedItems = [];
          this.likedItemsTotal = 0;
        }
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
</style>
