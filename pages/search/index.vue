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
          :facets="selectedFacets"
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
        <SearchFacet
          v-for="(fields, name) in facets"
          :key="name"
          :name="name"
          :fields="fields"
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import SearchFacet from '../../components/search/SearchFacet';
  import SearchForm from '../../components/search/SearchForm';
  import SearchResultsList from '../../components/search/SearchResultsList';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import PaginationNav from '../../components/generic/PaginationNav';
  import search from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      SearchFacet,
      SearchForm,
      SearchResultsList,
      SearchSelectedFacets,
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
        page: 1,
        facets: {},
        selectedFacets: {}
      };
    },
    asyncData ({ env, query, res }) {
      const currentPage = query.page ? Number(query.page) : 1;
      if (typeof query.query === 'undefined') {
        return;
      }
      return search({
        page: currentPage,
        query: query.query,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return { ...response, query: query.query, page: Number(currentPage) };
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
      },
      selectFacet (name, selected) {
        this.$set(this.selectedFacets, name, selected);
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
