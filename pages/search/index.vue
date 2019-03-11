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
        <SearchSelectedFacets
          :selected="typeFacet"
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
      class="mb-3"
    >
      <b-col>
        <SearchFacets
          @changed="selectTypeFacet"
        />
      </b-col>
      <b-col
        cols="12"
        lg="9"
      >
        <template v-if="results !== null">
          <SearchResultsList :results="results" />
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
  import search from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      SearchForm,
      SearchFacets,
      SearchSelectedFacets,
      SearchResultsList
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
        typeFacet: null
      };
    },
    asyncData ({ env, query, res }) {
      if (typeof query.query === 'undefined') {
        return;
      }
      return search({
        query: query.query,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((results) => {
          return { ...results, query: query.query };
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
          this.$router.push({ name: 'search', query: { query: this.query || '' } });
        }
      },
      selectTypeFacet (selected) {
        this.typeFacet = selected;
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    watchQuery: ['query']
  };
</script>
