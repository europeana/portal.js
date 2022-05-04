<template>
  <div>
    <b-container
      data-qa="search page"
      class="page-container side-filters-enabled"
    >
      <b-row
        class="flex-row-reverse flex-nowrap"
      >
        <SideFilters />
        <b-col
          class="results-col"
        >
          <SearchInterface
            id="search-interface"
            :per-row="4"
            :show-related="showRelated"
          >
            <template
              v-if="searchQuery"
              #related
            >
              <client-only>
                <RelatedSection
                  :query="searchQuery"
                  @show="showRelatedSection"
                  @hide="hideRelatedSection"
                />
              </client-only>
            </template>
          </SearchInterface>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import SearchInterface from '@/components/search/SearchInterface';

  export default {
    name: 'SearchPage',

    components: {
      ClientOnly,
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

    data() {
      return {
        showRelated: false
      };
    },

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
    },

    methods: {
      showRelatedSection() {
        this.showRelated = true;
      },

      hideRelatedSection() {
        this.showRelated = false;
      }
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

  .container {
    max-width: none;
  }

  .results-col {
    min-width: 0;
  }
</style>
