<template>
  <div>
    <NotificationBanner
      v-if="redirectNotificationsEnabled"
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
          :style="sideFiltersEnabled && resultsColumnStyles"
        >
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
            :per-row="4"
          />
        </b-col>
        <b-col
          v-if="sideFiltersEnabled"
          class="col-filters col-3"
        >
          <SideFilters
            ref="sideFiltersColumn"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SearchInterface from '../../components/search/SearchInterface';
  import legacyUrl from '../../plugins/europeana/legacy-search';
  import NotificationBanner from '../../components/generic/NotificationBanner';
  import SideFilters from '../../components/search/SideFilters';

  export default {
    components: {
      SearchInterface,
      NotificationBanner,
      RelatedSection: () => import('../../components/search/RelatedSection'),
      SideFilters
    },

    middleware: 'sanitisePageQuery',

    async fetch({ store, query, res, $apis }) {
      await store.dispatch('search/activate');
      store.commit('search/set', ['userParams', query]);

      await store.dispatch('search/run', $apis.record.search);
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
    },
    data() {
      return {
        sideFiltersHeight: null
      };
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
      },
      resultsColumnStyles() {
        return { maxHeight: `${this.sideFiltersHeight}px`,
                 overflow: 'auto' };
      }
    },

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
      if (this.sideFiltersEnabled) {
        this.$nextTick(() => {
          this.sideFiltersHeight = this.$refs.sideFiltersColumn.$el.getBoundingClientRect().height;
        });
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.searchQuery ? this.$t('searchResultsFor', [this.searchQuery]) : this.$t('search'))
      };
    },

    async beforeRouteLeave(to, from, next) {
      // Leaving the search page closes the search bar. Reevaluate when autosuggestions go straight to entity pages.
      this.$store.commit('search/setShowSearchBar', false);
      await this.$store.dispatch('search/deactivate');
      next();
    },

    watchQuery: ['api', 'reusability', 'query', 'qf', 'page']
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
  .col-filters {
    max-width: 320px;
    min-width: 220px;
    flex-grow: 0;
    padding: 0;
    background-color: $white;
    margin-top: -1rem;
  }
</style>
