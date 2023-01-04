<template>
  <div data-qa="search page">
    <SearchInterface
      id="search-interface"
      :override-params="searchOverrides"
    >
      <template
        v-if="!!searchQuery"
        #related
      >
        <client-only>
          <RelatedSection
            :query="searchQuery"
            :overrides="relatedCollections"
            data-qa="related section"
            @fetched="handleRelatedSectionFetched"
          />
        </client-only>
      </template>
      <template
        v-if="!!searchQuery"
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
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'SearchPage',

    components: {
      ClientOnly,
      SearchInterface,
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      RelatedSection: () => import('@/components/search/RelatedSection')
    },

    mixins: [pageMetaMixin],

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

    computed: {
      pageMeta() {
        return {
          title: this.searchQuery ? this.$t('searchResultsFor', [this.searchQuery]) : this.$t('search.title')
        };
      },
      searchQuery() {
        return this.$route.query.query;
      },
      searchOverrides() {
        const sort = 'score desc,contentTier desc, random_ asc, timestamp_update desc,europeana_id asc';
        return !this.searchQuery && !this.$route.query.sort ? { sort } : {};
      }
    },

    watch: {
      searchQuery() {
        this.relatedCollections = null;
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
