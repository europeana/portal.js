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
              <b-tabs
                v-model="activeTabIndex"
                align="center"
                class="w-100"
              >
                <b-tab
                  data-qa="likes collection"
                  :title-link-attributes="{ 'aria-label': $t('account.likes'), href: HASH_LIKES }"
                >
                  <template #title>
                    {{ $t('account.likes') }}
                  </template>
                  <client-only>
                    <AlertMessage
                      v-if="$fetchState.error"
                      :error="$fetchState.error.message"
                    />
                    <ItemPreviewInterface
                      v-else
                      :ref="HASH_LIKES"
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
                  </client-only>
                </b-tab>
                <b-tab
                  data-qa="public collections"
                  :title-link-attributes="{ 'aria-label': $t('account.publicCollections'), href: HASH_PUBLIC_GALLERIES }"
                >
                  <template #title>
                    {{ $t('account.publicCollections') }}
                  </template>
                  <client-only>
                    <UserSets
                      v-if="activeTabHash === HASH_PUBLIC_GALLERIES"
                      :ref="HASH_PUBLIC_GALLERIES"
                      class="tab-content"
                      visibility="public"
                      :empty-text="$t('account.notifications.noCollections.public')"
                      data-qa="public sets"
                    />
                  </client-only>
                </b-tab>
                <b-tab
                  data-qa="private collections"
                  :title-link-attributes="{ 'aria-label': $t('account.privateCollections'), href: HASH_PRIVATE_GALLERIES }"
                >
                  <template #title>
                    {{ $t('account.privateCollections') }}
                  </template>
                  <client-only>
                    <UserSets
                      v-if="activeTabHash === HASH_PRIVATE_GALLERIES"
                      :ref="HASH_PRIVATE_GALLERIES"
                      class="tab-content"
                      visibility="private"
                      :empty-text="$t('account.notifications.noCollections.private')"
                      data-qa="private sets"
                    />
                  </client-only>
                </b-tab>
                <b-tab
                  data-qa="published collections"
                  :title-link-attributes="{ 'aria-label': $t('account.publishedCollections'), href: HASH_PUBLISHED_GALLERIES }"
                >
                  <template #title>
                    {{ $t('account.publishedCollections') }}
                  </template>
                  <client-only>
                    <UserSets
                      v-if="activeTabHash === HASH_PUBLISHED_GALLERIES"
                      :ref="HASH_PUBLISHED_GALLERIES"
                      class="tab-content"
                      visibility="published"
                      :show-create-set-button="false"
                      :empty-text="$t('account.notifications.noCollections.published')"
                      data-qa="published sets"
                    />
                  </client-only>
                </b-tab>
                <b-tab
                  v-if="userIsEditor"
                  data-qa="curated collections"
                  :title-link-attributes="{ 'aria-label': $t('account.curatedCollections'), href: HASH_CURATED_COLLECTIONS }"
                >
                  <template #title>
                    {{ $t('account.curatedCollections') }}
                  </template>
                  <client-only>
                    <UserSets
                      v-if="userIsEditor && activeTabHash === HASH_CURATED_COLLECTIONS"
                      :ref="HASH_CURATED_COLLECTIONS"
                      class="tab-content"
                      type="EntityBestItemsSet"
                      :show-create-set-button="false"
                      :empty-text="$t('account.notifications.noCollections.curated')"
                      data-qa="curated sets"
                    />
                  </client-only>
                </b-tab>
              </b-tabs>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BTab, BTabs } from 'bootstrap-vue';
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
      BTab,
      BTabs,
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

      const { activeTabHash, activeTabIndex, watchTabIndex, unwatchTabIndex } = useActiveTab(tabHashes);

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

    mounted() {
      this.watchTabIndex();
    },

    beforeDestroy() {
      this.unwatchTabIndex();
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
