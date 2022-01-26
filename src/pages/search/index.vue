<template>
  <div>
    <b-container
      data-qa="search page"
      class="page-container side-filters-enabled"
    >
      <b-row
        class="flex-row-reverse"
        :class="{'flex-nowrap': sideFiltersEnabled}"
      >
        <SideFilters />
        <b-col
          class="results-col"
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
            id="search-interface"
            :per-row="4"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SearchInterface from '@/components/search/SearchInterface';

  export default {
    name: 'SearchPage',

    components: {
      SearchInterface,
      RelatedSection: () => import('@/components/search/RelatedSection'),
      SideFilters: () => import('@/components/search/SideFilters')
    },

    async beforeRouteLeave(to, from, next) {
      // Leaving the search page closes the search bar. Reevaluate when autosuggestions go straight to entity pages.
      this.$store.commit('search/setShowSearchBar', false);
      next();
    },

    middleware: 'sanitisePageQuery',

    fetch() {
      this.$store.commit('search/set', ['overrideParams', {}]);
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.searchQuery ? this.$t('searchResultsFor', [this.searchQuery]) : this.$t('search'))
      };
    },

    computed: {
      searchQuery() {
        return this.$route.query.query;
      }
    },

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

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

  .results-col {
    min-width: 0;
  }
</style>
