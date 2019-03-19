<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
      class="mb-3"
    >
      <b-col>
        <SearchForm
          v-model="query"
          :is-loading="isLoading"
          @submit:searchForm="submitSearchForm"
        />
        <SearchSelectedFacets
          :selected="selectedFacets"
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
    <b-row
      v-if="totalResults !== null"
      class="mb-3"
    >
      <b-col>
        <p data-qa="total results">
          Results: {{ totalResults | localise }}
        </p>
      </b-col>
    </b-row>
    <b-row
      class="mb-3"
    >
      <b-col>
        <SearchFacets
          :options="facets"
          @changed="selectFacet"
        />
      </b-col>
      <b-col
        cols="12"
        lg="9"
      >
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
              <p
                v-if="results.length == 0"
              >
                There are no more results for your search query.
              </p>
              <SearchResultsList
                v-else
                :results="results"
              />
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import SearchForm from '../../components/search/SearchForm';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import SearchFacets from '../../components/search/SearchFacets';
  import SearchResultsList from '../../components/search/SearchResultsList';
  import PaginationNav from '../../components/generic/PaginationNav';
  import search, { pageFromQuery } from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      SearchForm,
      SearchFacets,
      SearchSelectedFacets,
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
        facets: null,
        selectedFacets: null,
        page: 1
      };
    },
    asyncData ({ env, query, res, redirect }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect({ name: 'search', query: query });
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
          return { ...results, query: query.query, facets: results.facets, page: Number(currentPage) };
        })
        .catch((error) => {
          let errorMessage = error.message;
          if (typeof res !== 'undefined') {
            if (error.message.startsWith('Invalid query')) {
              res.statusCode = 400;
            } else {
              const paginationError = error.message.match(/It is not possible to paginate beyond the first (\d+)/);
              if (paginationError !== null) {
                res.statusCode = 400;
                errorMessage = `It is only possible to view the first ${paginationError[1]} search results.`;
              } else {
                res.statusCode = 500;
              }
            }
          }
          return { results: null, error: errorMessage, query: query.query };
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
      selectFacet (selected) {
        this.selectedFacets = selected;
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
