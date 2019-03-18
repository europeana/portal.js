<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
      class="mb-5"
    >
      <b-col>
        <SearchForm
          v-model="query"
          :is-loading="isLoading"
          @submit:searchForm="submitSearchForm"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="error"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="error"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="totalResults === 0"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="errorNoResults"
        />
      </b-col>
    </b-row>
    <template
      v-if="results !== null"
    >
      <b-row>
        <b-col>
          <PaginationNav
            v-if="totalResults > perPage"
            v-model="page"
            :total-results="totalResults"
            :per-page="perPage"
            :link-gen="paginationLink"
          />
        </b-col>
      </b-row>
      <b-row
        class="mb-3"
      >
        <b-col>
          <SearchResultsList :results="results" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <PaginationNav
            v-if="totalResults > perPage"
            v-model="page"
            :total-results="totalResults"
            :per-page="perPage"
            :link-gen="paginationLink"
          />
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import SearchForm from '../../components/search/SearchForm';
  import SearchResultsList from '../../components/search/SearchResultsList';
  import PaginationNav from '../../components/generic/PaginationNav';
  import search, { pageFromQuery } from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      SearchForm,
      SearchResultsList,
      PaginationNav
    },
    props: {
      perPage: {
        type: Number,
        default: 24
      }
    },
    data () {
      return {
        error: null,
        errorNoResults: 'No results',
        isLoading: false,
        inHeader: false,
        results: null,
        totalResults: null,
        query: null,
        page: 1
      };
    },
    asyncData ({ env, query, res, redirect }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect({ name: 'search', query: { query: query.query || '', page: '1' } });
      }

      if (typeof query.query === 'undefined') {
        return;
      }
      return search({
        page: currentPage,
        query: query.query,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((results) => {
          return { ...results, query: query.query, page: Number(currentPage) };
        })
        .catch((err) => {
          if (typeof res !== 'undefined') {
            res.statusCode = err.message.startsWith('Invalid query') ? 400 : 500;
          }
          return { results: null, error: err.message, query: query.query };
        });
    },
    mounted () {
      this.$nextTick(() => {
        if (document.getElementById('searchResults') === null) {
          const searchQuery = document.getElementById('searchQuery');
          if (searchQuery) {
            searchQuery.focus();
          }
        }
      });
    },
    methods: {
      submitSearchForm () {
        if (this.$route.query.query !== this.query) {
          this.isLoading = true;
          this.$router.push({ name: 'search', query: { query: this.query || '', page: '1' } });
        }
      },
      paginationLink (val) {
        return { name: 'search', query: { query: this.query, page: val } };
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    watchQuery: ['page', 'query']
  };
</script>
