<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{ $t('search') }}</h1>
      </b-col>
      <SearchInterface
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
  import SearchInterface from '../../components/search/SearchInterface';
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../plugins/europeana/search';

  export default {
    components: {
      SearchInterface
    },
    data() {
      return {
        error: null,
        facets: [],
        lastAvailablePage: false,
        page: 1,
        query: '',
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
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            page: Number(currentPage),
            query: query.query,
            selectedFacets: selectedFacetsFromQuery(query)
          };
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    fetch({ store, query }) {
      store.commit('search/setQuery', query.query);
      store.commit('search/setActive', true);
    },
    head() {
      return {
        title: this.$t('search')
      };
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('search/setActive', false);
      next();
    },
    watchQuery: ['query']
  };
</script>
