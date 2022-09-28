<template>
  <div data-qa="search page">
    <SearchInterface
      id="search-interface"
    >
      <template
        v-if="!!searchQuery"
        #related
      >
        <client-only>
          <RelatedSection
            :query="searchQuery"
            :overrides="relatedCollections"
            @fetched="handleRelatedSectionFetched"
          />
        </client-only>
      </template>
      <template
        v-if="searchQuery"
        #after-results
      >
        <client-only>
          <b-container class="px-0">
            <RelatedEditorial
              :query="searchQuery"
            />
          </b-container>
        </client-only>
      </template>
    </SearchInterface>
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
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      RelatedSection: () => import('@/components/search/RelatedSection')
    },

    async beforeRouteLeave(to, from, next) {
      // Leaving the search page closes the search bar. Reevaluate when autosuggestions go straight to entity pages.
      this.$store.commit('search/setShowSearchBar', false);
      next();
    },

    middleware: 'sanitisePageQuery',

    data() {
      return {
        relatedCollections: null
      };
    },

    fetch() {
      this.$store.commit('search/set', ['overrideParams', {}]);
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.searchQuery ? this.$t('searchResultsFor', [this.searchQuery]) : this.$t('search.title'))
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
      handleRelatedSectionFetched(relatedCollections) {
        this.relatedCollections = relatedCollections;
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

  .page-container {
    max-width: none;
  }
</style>
