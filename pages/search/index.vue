<template>
  <b-container data-qa="search page">
    <b-row>
      <b-col>
        <h1>{{ $t('search') }}</h1>
      </b-col>
      <SearchInterface
        :per-row="4"
      />
    </b-row>
  </b-container>
</template>

<script>
  import SearchInterface from '../../components/search/SearchInterface';
  import { pageFromQuery } from '../../plugins/utils';

  export default {
    components: {
      SearchInterface
    },

    middleware({ query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.localePath({ name: 'search', query: { ...query, ...{ page: '1' } } }));
      }
    },

    async fetch({ store, query, res }) {
      await store.dispatch('search/activate');
      store.commit('search/set', ['userParams', query]);

      // TODO: remove when enabled by default
      if (Number(process.env.ENABLE_FASHION_COLLECTION_FACETS)) {
        store.commit('collections/fashion/enable');
      }

      await store.dispatch('search/run');
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
    },

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
    },

    head() {
      return {
        title: this.$t('search')
      };
    },

    async beforeRouteLeave(to, from, next) {
      await this.$store.dispatch('search/deactivate');
      next();
    },

    watchQuery: ['api', 'reusability', 'query', 'qf', 'page']
  };
</script>
