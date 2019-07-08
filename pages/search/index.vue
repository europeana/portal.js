<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
      class="mb-3"
    >
      <b-col>
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
          :error="$t('noResults')"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="hasResults"
      class="mb-3"
    >
      <b-col>
        <p data-qa="total results">
          {{ $t('results') }}: {{ totalResults | localise }}
        </p>
      </b-col>
      <b-col>
        <ViewToggles
          :active="view"
          @changed="selectView"
        />
      </b-col>
    </b-row>
    <b-row
      class="mb-3"
    >
      <b-col>
        <SearchFacet
          v-for="facet in orderedFacets"
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
          v-if="hasResults"
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
                {{ $t('noMoreResults') }}
              </p>
              <SearchResultsList
                v-else-if="view == 'list'"
                :results="results"
              />
              <SearchResultsGrid
                v-else
                :results="results"
              />
              <InfoMessage
                v-if="lastAvailablePage"
                :message="$t('resultsLimitWarning')"
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
  import SearchResultsGrid from '../../components/search/SearchResultsGrid';
  import SearchResultsList from '../../components/search/SearchResultsList';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import PaginationNav from '../../components/generic/PaginationNav';
  import ViewToggles from '../../components/search/ViewToggles';
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      InfoMessage,
      SearchFacet,
      SearchResultsGrid,
      SearchResultsList,
      SearchSelectedFacets,
      PaginationNav,
      ViewToggles
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
        facets: [],
        inHeader: false,
        isLoading: false,
        lastAvailablePage: false,
        page: 1,
        qfForSelectedFacets: [],
        query: null,
        results: null,
        reusability: '',
        selectedFacets: {},
        totalResults: null,
        view: this.selectedView()
      };
    },
    computed: {
      hasResults: function() {
        return this.results !== null && this.totalResults > 0;
      },
      /**
       * Sort the facets from the API response
       * Facets are returned in the hard-coded preferred order, followed by all
       * others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets: function () {
        if (!this.facets) {
          return [];
        }
        const order = ['TYPE', 'REUSABILITY', 'COUNTRY'];
        let unordered = this.facets.slice();
        let ordered = [];
        for (const facetName of order) {
          const index = unordered.findIndex((f) => {
            return f.name == facetName;
          });
          if (index !== -1) {
            ordered = ordered.concat(unordered.splice(index, 1));
          }
        }
        return ordered.concat(unordered);
      }
    },
    watch: {
      query: {
        immediate: true,
        handler(val) {
          this.$root.$emit('updateSearchQuery', val);
        }
      }
    },
    asyncData ({ env, query, res, redirect, app }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({ name: 'search', query: query }));
      }

      if (typeof query.query === 'undefined') {
        return;
      }

      return search({
        page: currentPage,
        query: query.query,
        facet: 'COUNTRY,REUSABILITY,TYPE',
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
            selectedFacets: selectedFacetsFromQuery(query),
            qfForSelectedFacets: query.qf === '' ? [] : query.qf,
            reusability: query.reusability
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
          return { results: null, error: errorMessage, query: query.query };
        });
    },
    methods: {
      updateCurrentSearchQuery(updates) {
        const current = {
          page: this.page || '1',
          qf: this.qfForSelectedFacets,
          query: this.query || '',
          reusability: this.reusability,
          view: this.view
        };

        // If any values in the updates are `null`, remove them from the query
        for (const key in updates) {
          if (updates[key] === null) {
            delete current[key];
            delete updates[key];
          }
        }
        return { ...current, ...updates };
      },
      rerouteSearch(queryUpdates) {
        this.isLoading = true;
        this.$router.push(this.localePath({ name: 'search', query: this.updateCurrentSearchQuery(queryUpdates) }));
      },
      paginationLink (val) {
        return this.localePath({
          name: 'search', query: this.updateCurrentSearchQuery({ page: val })
        });
      },
      selectFacet (name, selected) {
        this.$set(this.selectedFacets, name, selected);
        this.qfForSelectedFacets = [];
        this.reusability = null;
        for (const facetName in this.selectedFacets) {
          const selectedValues = this.selectedFacets[facetName];
          // `reusability` has its own API parameter and can not be queried in `qf`
          if (facetName == 'REUSABILITY' && selectedValues.length > 0) {
            this.reusability = selectedValues.join(',');
          } else {
            for (const facetValue of selectedValues) {
              this.qfForSelectedFacets.push(`${facetName}:"${facetValue}"`);
            }
          }
        }
        this.rerouteSearch({ qf: this.qfForSelectedFacets, reusability: this.reusability, page: '1' });
      },
      selectView (view) {
        if (process.browser) {
          sessionStorage.searchResultsView = view;
          localStorage.searchResultsView = view;
        }
        this.view = view;
      },
      selectedView: function () {
        if (process.browser) {
          if (this.$route.query.view) {
            sessionStorage.searchResultsView = this.$route.query.view;
          }
          return sessionStorage.searchResultsView || localStorage.searchResultsView || 'grid';
        }
        return this.$route.query.view || 'grid';
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    beforeRouteLeave (to, from, next) {
      this.$root.$emit('leaveSearchPage');
      next();
    },
    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
