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
                  :to="localePath({ hash: tabHashes.likes })"
                  :active="activeTab === tabHashes.likes"
                >
                  {{ $t('account.likes') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="public collections"
                  :to="localePath({ hash: tabHashes.publicGalleries })"
                  :active="activeTab === tabHashes.publicGalleries"
                >
                  {{ $t('account.publicCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="private collections"
                  :to="localePath({ hash: tabHashes.privateGalleries })"
                  :active="activeTab === tabHashes.privateGalleries"
                >
                  {{ $t('account.privateCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="published collections"
                  :to="localePath({ hash: tabHashes.publishedGalleries })"
                  :active="activeTab === tabHashes.publishedGalleries"
                >
                  {{ $t('account.publishedCollections') }}
                </b-nav-item>
                <b-nav-item
                  v-if="userIsEditor"
                  data-qa="curated collections"
                  :to="localePath({ hash: tabHashes.curatedCollections })"
                  :active="activeTab === tabHashes.curatedCollections"
                >
                  {{ $t('account.curatedCollections') }}
                </b-nav-item>
              </b-nav>
            </b-row>
          </b-container>
          <client-only>
            <template v-if="activeTab === tabHashes.likes">
              <AlertMessage
                v-if="$fetchState.error"
                :error="$fetchState.error.message"
              />
              <ItemPreviewInterface
                v-else
                :ref="tabHashes.likes"
                class="tab-content"
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
            <UserSets
              v-else-if="activeTab === tabHashes.publicGalleries"
              :ref="tabHashes.publicGalleries"
              class="tab-content"
              visibility="public"
              :empty-text="$t('account.notifications.noCollections.public')"
              data-qa="public sets"
              @fetched="focusActiveTab"
            />
            <UserSets
              v-else-if="activeTab === tabHashes.privateGalleries"
              :ref="tabHashes.privateGalleries"
              class="tab-content"
              visibility="private"
              :empty-text="$t('account.notifications.noCollections.private')"
              data-qa="private sets"
              @fetched="focusActiveTab"
            />
            <UserSets
              v-else-if="activeTab === tabHashes.publishedGalleries"
              :ref="tabHashes.publishedGalleries"
              class="tab-content"
              visibility="published"
              :show-create-set-button="false"
              :empty-text="$t('account.notifications.noCollections.published')"
              data-qa="published sets"
              @fetched="focusActiveTab"
            />
            <UserSets
              v-else-if="userIsEditor && activeTab === tabHashes.curatedCollections"
              :ref="tabHashes.curatedCollections"
              class="tab-content"
              type="EntityBestItemsSet"
              :show-create-set-button="false"
              :empty-text="$t('account.notifications.noCollections.curated')"
              data-qa="curated sets"
              @fetched="focusActiveTab"
            />
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BNav } from 'bootstrap-vue';
  import { mapState } from 'vuex';

  import pageMetaMixin from '@/mixins/pageMeta';
  import AlertMessage from '@/components/generic/AlertMessage';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import UserHeader from '@/components/user/UserHeader';
  import UserSets from '@/components/user/UserSets';

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

    data() {
      return {
        tabFocused: false,
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
      await this.fetchLikes();
      if (this.$route.hash === '#likes') {
        this.focusActiveTab();
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
      async fetchLikes() {
        await this.$store.dispatch('set/fetchLikes');
      },

      focusActiveTab() {
        if (!this.tabFocused && this.$route.hash) {
          const element = this.$refs[this.$route.hash]?.$el;
          element?.setAttribute('tabindex', '-1');
          element?.focus();
          this.tabFocused = true;
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

  .tab-content:focus {
    outline: none;
  }
</style>
