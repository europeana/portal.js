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
          v-for="facet in facets"
          :key="facet.name"
          :name="facet.name"
          :fields="facet.fields"
          :selected-fields="selectedFacets[facet.name]"
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
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../plugins/europeana/search';

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
      // TODO: make qfForSelectedFacets and reusabilityFacet and selectedFacets
      //       into computed properties?
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
        selectedFacets: {},
        qfForSelectedFacets: [],
        reusabilityFacet: ''
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
        reusability: query.reusability,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            isLoading: false,
            query: query.query,
            page: Number(currentPage),
            selectedFacets: selectedFacetsFromQuery(query)
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
      updateCurrentSearchQuery(updates) {
        const current = {
          query: this.query || '',
          page: this.page || '1',
          qf: this.qfForSelectedFacets,
          reusability: this.reusabilityFacet
        };
        return { ...current, ...updates };
      },
      rerouteSearch(queryUpdates) {
        this.isLoading = true;
        this.$router.push({ name: 'search', query: this.updateCurrentSearchQuery(queryUpdates) });
      },
      submitSearchForm () {
        if (this.$route.query.query !== this.query) {
          this.rerouteSearch({ query: this.query || '', page: '1' });
        }
      },
      paginationLink (val) {
        return {
          name: 'search', query: this.updateCurrentSearchQuery({ page: val })
        };
      },
      selectFacet (name, selected) {
        this.$set(this.selectedFacets, name, selected);
        this.qfForSelectedFacets = [];
        this.reusabilityFacet = null;
        for (const facetName in this.selectedFacets) {
          // `reusability` has its own API parameter and can not be queried in `qf`
          if (facetName == 'REUSABILITY') {
            this.reusabilityFacet = this.selectedFacets[facetName].join(',');
          } else {
            for (const facetValue of this.selectedFacets[facetName]) {
              this.qfForSelectedFacets.push(`${facetName}:${facetValue}`);
            }
          }
        }
        this.rerouteSearch({ qf: this.qfForSelectedFacets, reusability: this.reusabilityFacet });
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
