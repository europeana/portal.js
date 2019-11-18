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
    asyncData({ query, redirect, app }) {
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
    },
    async fetch({ store, query, res }) {
      store.commit('search/setActive', true);
      await store.dispatch('search/run', query);
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
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
    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
