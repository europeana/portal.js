<template>
  <b-container>
    <b-row>
      <b-col>
        <!-- TODO: i18n  -->
        <h1>Search</h1>
      </b-col>
      <SearchResults
        :error="error"
        :facets="facets"
        :last-available-page="lastAvailablePage"
        :page="page"
        :query="query"
        :results="results"
        :selected-facets="selectedFacets"
        :total-results="totalResults"
      />
    </b-row>
  </b-container>
</template>

<script>
  import SearchResults from '../../components/search/SearchResults';
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../plugins/europeana/search';

  export default {
    components: {
      SearchResults
    },
    data() {
      return {
        error: null,
        facets: [],
        lastAvailablePage: false,
        page: 1,
        query: null,
        results: [],
        selectedFacets: {},
        totalResults: null
      };
    },
    asyncData({ env, query, res, redirect, app }) {
      const currentPage = pageFromQuery(query.page);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({ name: 'search', query }));
      }

      if (typeof query.query === 'undefined') {
        query.query = '';
        return redirect(app.localePath({ name: 'search', query }));
      }

      return search({
        page: currentPage,
        qf: query.qf,
        query: query.query,
        reusability: query.reusability,
        theme: query.theme,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            query: query.query,
            page: Number(currentPage),
            selectedFacets: selectedFacetsFromQuery(query)
          };
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message, query: query.query };
        });
    },
    head() {
      return {
        title: 'Search'
      };
    },
    beforeRouteLeave(to, from, next) {
      this.$root.$emit('leaveSearchPage');
      next();
    }
  };
</script>
