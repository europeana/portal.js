<template>
  <b-container>
    <b-row
      class="mb-3"
    >
      <b-col>
        <SearchSelectedFacets
          :facets="currentSelectedFacets"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="currentError"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="currentError"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="noResults"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="$t('noResults')"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="hasAnyResults"
      class="mb-3"
    >
      <b-col>
        <p data-qa="total results">
          {{ $t('results') }}: {{ currentTotalResults | localise }}
        </p>
      </b-col>
      <b-col>
        <ViewToggles
          :active="view"
          :link-gen-route="route"
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
          :type="facet.name === 'THEME' ? 'radio' : 'checkbox'"
          :fields="facet.fields"
          :selected-fields="currentSelectedFacets[facet.name]"
          @changed="selectFacet"
        />
      </b-col>
      <b-col
        cols="12"
        lg="9"
      >
        <b-row>
          <b-col>
            <PaginationNav
              v-if="showPagination"
              v-model="currentPage"
              :total-results="currentTotalResults"
              :per-page="perPage"
              :link-gen="paginationLink"
              @changed="changePage"
            />
          </b-col>
        </b-row>
        <b-row
          class="mb-3"
        >
          <b-col>
            <p
              v-if="noMoreResults"
              data-qa="warning notice"
            >
              {{ $t('noMoreResults') }}
            </p>
            <SearchResultsList
              v-else-if="view === 'list'"
              v-model="currentResults"
            />
            <SearchResultsGrid
              v-else
              v-model="currentResults"
            />
            <InfoMessage
              v-if="currentLastAvailablePage"
              :message="$t('resultsLimitWarning')"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <TierToggler
              v-if="showContentTierToggle"
              :active-state="contentTierActiveState"
              @changed="changeContentTierToggle"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <PaginationNav
              v-if="showPagination"
              v-model="currentPage"
              :total-results="currentTotalResults"
              :per-page="perPage"
              :link-gen="paginationLink"
              @changed="changePage"
            />
          </b-col>
        </b-row>
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
  import TierToggler from '../../components/search/TierToggler';
  import search, { selectedFacetsFromQuery } from '../../plugins/europeana/search';

  const thematicCollections = ['all', 'ww1',  'archaeology', 'art', 'fashion', 'manuscript', 'map', 'migration', 'music', 'nature', 'newspaper', 'photography', 'sport'];

  let watchList = {};
  for (const property of ['qf', 'query', 'reusability', 'view', 'theme']) {
    watchList[property] = {
      handler(val) {
        this.$root.$emit('updateSearchQuery', this.updateCurrentSearchQuery({ [property]: val }));
      }
    };
  }
  for (const property of ['currentPage', 'currentQuery', 'currentSelectedFacets']) {
    watchList[property] = {
      deep: true,
      handler() {
        if (property !== 'currentPage') {
          this.currentPage = 1;
        }
        this.rerouteSearch(this.updateCurrentSearchQuery());
        this.updateResults();
      }
    };
  }

  export default {
    components: {
      AlertMessage,
      InfoMessage,
      SearchFacet,
      SearchResultsGrid,
      SearchResultsList,
      SearchSelectedFacets,
      PaginationNav,
      ViewToggles,
      TierToggler
    },
    // TODO: should any of these be required props?
    props: {
      error: {
        type: String,
        default: null
      },
      excludeFromRouteQuery: {
        type: Array,
        default: () => []
      },
      facets: {
        type: Array,
        default: () => []
      },
      lastAvailablePage: {
        type: Boolean,
        default: false
      },
      page: {
        type: Number,
        default: 1
      },
      perPage: {
        type: Number,
        default: 24
      },
      query: {
        type: String,
        default: null
      },
      results: {
        type: Array,
        default: () => []
      },
      route: {
        type: Object,
        default: () => {
          return { name: 'search' };
        }
      },
      selectedFacets: {
        type: Object,
        default: () => {
          return {};
        }
      },
      showContentTierToggle: {
        type: Boolean,
        default: true
      },
      totalResults: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        currentError: this.error,
        currentFacets: this.facets,
        currentLastAvailablePage: this.lastAvailablePage,
        currentPage: this.page,
        currentQuery: this.query,
        currentResults: this.results,
        currentSelectedFacets: this.selectedFacets,
        currentTotalResults: this.totalResults,
        facetDisplayOrder: ['TYPE', 'REUSABILITY', 'COUNTRY'],
        view: this.selectedView()
      };
    },
    computed: {
      contentTierActiveState() {
        return Object.prototype.hasOwnProperty.call(this.selectedFacets, 'contentTier') && this.selectedFacets['contentTier'].includes('*');
      },
      hasAnyResults() {
        return this.currentTotalResults > 0;
      },
      noMoreResults() {
        return this.hasAnyResults && this.currentResults.length === 0;
      },
      noResults() {
        return this.currentTotalResults === 0;
      },
      /**
       * Sort the facets from the API response
       * Facets are returned in the hard-coded preferred order, followed by all
       * others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets() {
        if (!this.currentFacets) {
          return [];
        }
        let unordered = this.currentFacets.slice();
        let ordered = [];

        for (const facetName of this.facetDisplayOrder) {
          const index = unordered.findIndex((f) => {
            return f.name === facetName;
          });
          if (index !== -1) {
            ordered = ordered.concat(unordered.splice(index, 1));
          }
        }

        ordered.unshift({ name: 'THEME', fields: thematicCollections });
        return ordered.concat(unordered);
      },
      qf() {
        let qfForSelectedFacets = [];
        for (const facetName in this.currentSelectedFacets) {
          const selectedValues = this.currentSelectedFacets[facetName];
          // `reusability` and `theme` have their own API parameter and can not be queried in `qf`
          if (!['REUSABILITY', 'THEME'].includes(facetName)) {
            for (const facetValue of selectedValues) {
              if (this.facetDisplayOrder.includes(facetName)) {
                qfForSelectedFacets.push(`${facetName}:"${facetValue}"`);
              } else {
                qfForSelectedFacets.push(`${facetName}:${facetValue}`);
              }
            }
          }
        }
        return qfForSelectedFacets;
      },
      reusability() {
        if (this.currentSelectedFacets['REUSABILITY'] && this.currentSelectedFacets['REUSABILITY'].length > 0) {
          return this.currentSelectedFacets['REUSABILITY'].join(',');
        } else {
          return undefined;
        }
      },
      theme() {
        if (this.currentSelectedFacets['THEME'] && this.currentSelectedFacets['THEME'] !== '') {
          return this.currentSelectedFacets['THEME'];
        } else {
          return undefined;
        }
      },
      showPagination() {
        return this.currentTotalResults > this.perPage;
      }
    },
    watch: watchList,
    created() {
      this.$root.$on('submit:searchForm', (query) => {
        this.currentQuery = query;
        this.currentPage = 1;
      });
    },
    methods: {
      changeContentTierToggle() {
        this.currentSelectedFacets = selectedFacetsFromQuery(this.$route.query);
      },
      changePage(page) {
        this.currentPage = page;
      },
      paginationLink(val) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ page: val }) } });
      },
      rerouteSearch(queryUpdates) {
        this.$router.push(this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery(queryUpdates) } }));
      },
      selectedView() {
        if (process.browser) {
          if (this.$route.query.view) {
            sessionStorage.searchResultsView = this.$route.query.view;
          }
          return sessionStorage.searchResultsView || localStorage.searchResultsView || 'grid';
        }
        return this.$route.query.view || 'grid';
      },
      selectFacet(name, selected) {
        this.$set(this.currentSelectedFacets, name, selected);
      },
      selectView(view) {
        if (process.browser) {
          sessionStorage.searchResultsView = view;
          localStorage.searchResultsView = view;
        }
        this.view = view;
      },
      updateCurrentSearchQuery(updates = {}) {
        const current = {
          page: this.currentPage || '1',
          qf: this.qf,
          query: this.currentQuery || '',
          reusability: this.reusability,
          theme: this.theme,
          view: this.view
        };

        const updated = { ...current, ...updates };
        for (const exclusion of this.excludeFromRouteQuery) {
          delete updated[exclusion];
        }

        // If any updated values are `null`, remove them from the query
        for (const key in updated) {
          if (updated[key] === null) {
            delete updated[key];
          }
        }
        return updated;
      },
      updateResults() {
        search({
          page: this.currentPage,
          qf: this.qf,
          query: this.currentQuery,
          reusability: this.reusability,
          theme: this.theme,
          wskey: process.env.EUROPEANA_API_KEY
        })
          .then((response) => {
            this.currentError = response.error;
            this.currentFacets = response.facets;
            this.currentResults = response.results;
            this.currentTotalResults = response.totalResults;
            // TODO: make last available page a computed method in this component?
            this.currentLastAvailablePage = response.lastAvailablePage;
          });
        // TODO: error handling (but in plugin?)
      }
    }
  };
</script>
