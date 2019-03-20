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
          :selected-fields="selectedFacets[name]"
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
                data-qa="warning notice"
              >
                There are no more results for your search query.
              </p>
              <SearchResultsList
                v-else
                :results="results"
              />
              <InfoMessage
                v-if="this.lastAvailablePage"
                message="Additional results are not shown as only the first 1000 most relevant results are shown. If you haven't found what you're looking for, please consider refining your search."
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
  import InfoMessage from '../../components/generic/InfoMessage';
  import SearchFacet from '../../components/search/SearchFacet';
  import SearchForm from '../../components/search/SearchForm';
  import SearchResultsList from '../../components/search/SearchResultsList';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import PaginationNav from '../../components/generic/PaginationNav';
  import search, { pageFromQuery, selectedFacetsFromQueryQf } from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      InfoMessage,
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
        lastAvailablePage: false,
        query: null,
        page: 1,
        facets: {},
        selectedFacets: {}
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
        qf: query.qf,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            isLoading: false,
            query: query.query,
            page: Number(currentPage),
            selectedFacets: selectedFacetsFromQueryQf(query.qf)
          };
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
          // TODO: include selectedFacets?
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
          this.$router.push({ name: 'search', query: { query: this.query || '', page: '1', qf: this.qfForSelectedFacets } });
        }
      },
      paginationLink (val) {
        return {
          name: 'search', query: { query: this.query, page: val, qf: this.qfForSelectedFacets }
        };
      },
      selectFacet (name, selected) {
        this.$set(this.selectedFacets, name, selected);
        this.qfForSelectedFacets = [];
        for (const facetName in this.selectedFacets) {
          for (const facetValue of this.selectedFacets[facetName]) {
            this.qfForSelectedFacets.push(`${facetName}:${facetValue}`);
          }
        }
        this.isLoading = true;
        this.$router.push({ name: 'search', query: { query: this.query || '', page: '1', qf: this.qfForSelectedFacets } });
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    watchQuery: ['page', 'qf', 'query']
  };
</script>
