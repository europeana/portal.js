<template>
  <div>
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <PageHeader :search-query="searchQuery" />
    <nuxt
      id="main"
    />
    <PageFooter />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue';
  import PageFooter from '../components/PageFooter.vue';

  export default {
    components: {
      PageHeader,
      PageFooter
    },
    data() {
      return {
        searchQuery: this.$route.query || {}
      };
    },
    created() {
      this.$root.$on('leaveSearchPage', () => {
        this.searchQuery = {};
      });
      this.$root.$on('updateSearchQuery', (val) => {
        this.searchQuery = val;
      });
      this.$root.$on('submit:searchForm', (val) => {
        this.searchQuery.query = val;
      });
    },
    updated() {
      if (!Object.prototype.hasOwnProperty.call(this.searchQuery, 'view')) {
        this.searchQuery.view = sessionStorage.searchResultsView || localStorage.searchResultsView || 'grid';
      }
    }
  };
</script>
