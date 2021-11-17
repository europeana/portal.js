<template>
  <div>
    <NotificationBanner
      v-if="redirectNotificationsEnabled && !sideFiltersEnabled"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.search.text')"
      :notification-link-text="$t('linksToClassic.search.linkText')"
      class="mb-3"
    />
    <b-container
      data-qa="search page"
      :class="{'page-container': sideFiltersEnabled}"
    >
      <b-row>
        <b-col
          :class="{'px-0': !sideFiltersEnabled}"
        >
          <NotificationBanner
            v-if="redirectNotificationsEnabled && sideFiltersEnabled"
            :notification-url="notificationUrl"
            :notification-text="$t('linksToClassic.search.text')"
            :notification-link-text="$t('linksToClassic.search.linkText')"
            class="notification-banner mb-3"
          />
          <b-container>
            <b-row>
              <b-col>
                <i18n
                  :path="searchQuery ? 'searchResultsFor' : 'searchResults'"
                  tag="h1"
                >
                  <span data-qa="search query">{{ searchQuery }}</span>
                </i18n>
              </b-col>
            </b-row>
          </b-container>
          <RelatedSection
            v-if="searchQuery"
            :query="searchQuery"
            class="mb-4"
          />
          <SearchInterface
            id="search-interface"
            :per-row="4"
          />
        </b-col>
        <SideFilters
          v-if="sideFiltersEnabled"
        />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SearchInterface from '@/components/search/SearchInterface';
  import legacyUrl from '@/plugins/europeana/legacy-search';
  import NotificationBanner from '@/components/generic/NotificationBanner';

  export default {
    components: {
      SearchInterface,
      NotificationBanner,
      RelatedSection: () => import('@/components/search/RelatedSection'),
      SideFilters: () => import('@/components/search/SideFilters')
    },

    middleware: 'sanitisePageQuery',

    fetch() {
      this.$store.commit('search/set', ['overrideParams', {}]);
    },

    computed: {
      notificationUrl() {
        return legacyUrl(this.$route.query, this.$i18n.locale) +
          '&utm_source=new-website&utm_medium=button';
      },
      redirectNotificationsEnabled() {
        return this.$config.app.features.linksToClassic;
      },
      searchQuery() {
        return this.$route.query.query;
      },
      sideFiltersEnabled() {
        return this.$config.app.features.sideFilters;
      }
    },

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.searchQuery ? this.$t('searchResultsFor', [this.searchQuery]) : this.$t('search'))
      };
    },

    async beforeRouteLeave(to, from, next) {
      // Leaving the search page closes the search bar. Reevaluate when autosuggestions go straight to entity pages.
      this.$store.commit('search/setShowSearchBar', false);
      next();
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  h1 {
    font-size: 1.875rem;
    font-weight: 300;
    line-height: 1.375;
    margin-bottom: 1rem;
    span {
      font-weight: 600;
    }
  }
  .page-container {
    max-width: none;
  }
  .notification-banner {
    margin-left: -15px;
    margin-right: -15px;
    width: auto;
  }
</style>
