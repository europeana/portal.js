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
                id="account-page-nav"
                tabs
                align="center"
                class="w-100"
              >
                <b-nav-item
                  data-qa="likes collection"
                  :to="localePath({ hash: `#${LIKES}` })"
                  :active="activeTabId === LIKES"
                >
                  {{ $t('account.likes') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="public collections"
                  :to="localePath({ hash: `#${PUBLIC_GALLERIES}` })"
                  :active="activeTabId === PUBLIC_GALLERIES"
                >
                  {{ $t('account.publicCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="private collections"
                  :to="localePath({ hash: `#${PRIVATE_GALLERIES}` })"
                  :active="activeTabId === PRIVATE_GALLERIES"
                >
                  {{ $t('account.privateCollections') }}
                </b-nav-item>
                <b-nav-item
                  data-qa="published collections"
                  :to="localePath({ hash: `#${PUBLISHED_GALLERIES}` })"
                  :active="activeTabId === PUBLISHED_GALLERIES"
                >
                  {{ $t('account.publishedCollections') }}
                </b-nav-item>
                <b-nav-item
                  v-if="userIsEditor"
                  data-qa="curated collections"
                  :to="localePath({ hash: `#${CURATED_COLLECTIONS}` })"
                  :active="activeTabId === CURATED_COLLECTIONS"
                >
                  {{ $t('account.curatedCollections') }}
                </b-nav-item>
              </b-nav>
            </b-row>
          </b-container>
          <client-only>
            <UserLikes
              v-if="activeTabId === LIKES"
              data-qa="liked items"
            />
            <UserSets
              v-else-if="activeTabId === PUBLIC_GALLERIES"
              visibility="public"
              :empty-text="$t('account.notifications.noCollections.public')"
              data-qa="public sets"
            />
            <UserSets
              v-else-if="activeTabId === PRIVATE_GALLERIES"
              visibility="private"
              :empty-text="$t('account.notifications.noCollections.private')"
              data-qa="private sets"
            />
            <UserSets
              v-else-if="activeTabId === PUBLISHED_GALLERIES"
              visibility="published"
              :show-create-set-button="false"
              :empty-text="$t('account.notifications.noCollections.published')"
              data-qa="published sets"
            />
            <UserSets
              v-else-if="userIsEditor && (activeTabId === CURATED_COLLECTIONS)"
              type="EntityBestItemsSet"
              :show-create-set-button="false"
              :empty-text="$t('account.notifications.noCollections.curated')"
              data-qa="curated sets"
            />
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { BNav, BNavItem } from 'bootstrap-vue';

  import pageMetaMixin from '@/mixins/pageMeta';
  import UserHeader from '@/components/user/UserHeader';
  import UserLikes from '@/components/user/UserLikes';
  import UserSets from '@/components/user/UserSets';
  import useActiveTab from '@/composables/activeTab.js';

  const CURATED_COLLECTIONS = 'curated-collections';
  const LIKES = 'likes';
  const PRIVATE_GALLERIES = 'private-galleries';
  const PUBLIC_GALLERIES = 'public-galleries';
  const PUBLISHED_GALLERIES = 'published-galleries';

  export default {
    name: 'AccountIndexPage',

    components: {
      BNav,
      BNavItem,
      ClientOnly,
      UserHeader,
      UserLikes,
      UserSets
    },

    mixins: [
      pageMetaMixin
    ],

    middleware: 'auth',

    setup() {
      const tabIds = [
        LIKES,
        PUBLIC_GALLERIES,
        PRIVATE_GALLERIES,
        PUBLISHED_GALLERIES,
        CURATED_COLLECTIONS
      ];

      const { activeTabId } = useActiveTab(tabIds, { replaceRoute: false });

      return {
        activeTabId
      };
    },

    data() {
      return {
        CURATED_COLLECTIONS,
        LIKES,
        PRIVATE_GALLERIES,
        PUBLIC_GALLERIES,
        PUBLISHED_GALLERIES
      };
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('account.title')
        };
      },
      userIsEditor() {
        return this.$auth.userHasClientRole('entities', 'editor') &&
          this.$auth.userHasClientRole('usersets', 'editor');
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
