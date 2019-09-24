<template>
  <b-container>
    <b-row
      v-if="errorMessage"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="errorMessage"
        />
      </b-col>
    </b-row>
    <template
      v-else
    >
      <b-row
        class="mb-3"
      >
        <b-col>
          <SearchSelectedFacets
            :facets="currentSelectedFacets"
          />
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <FacetDropdown
            v-for="facet in orderedFacets"
            :key="facet.name"
            :name="facet.name"
            :fields="facet.fields"
            type="checkbox"
            :selected="currentSelectedFacets[facet.name]"
            @changed="changeFacet"
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
            :link-gen-route="route"
          />
        </b-col>
      </b-row>
      <b-row
        class="mb-3"
      >
        <b-col
          cols="12"
        >
          <b-row>
            <b-col>
              <PaginationNav
                v-if="showPagination"
                v-model="page"
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
              <SearchResults
                v-model="currentResults"
                :view="view"
                :per-row="perRow"
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
                v-model="page"
                :total-results="currentTotalResults"
                :per-page="perPage"
                :link-gen="paginationLink"
                @changed="changePage"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import InfoMessage from '../../components/generic/InfoMessage';
  import FacetDropdown from '../../components/search/FacetDropdown';
  import SearchResults from '../../components/search/SearchResults';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import PaginationNav from '../../components/generic/PaginationNav';
  import ViewToggles from '../../components/search/ViewToggles';
  import TierToggler from '../../components/search/TierToggler';
  import search, { defaultFacets, selectedFacetsFromQuery } from '../../plugins/europeana/search';
  import Vue from 'vue';

  export default {
    components: {
      AlertMessage,
      InfoMessage,
      FacetDropdown,
      SearchResults,
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
      facets: {
        type: Array,
        default: () => []
      },
      hiddenSearchParams: {
        type: Object,
        default: () => {
          return {};
        }
      },
      lastAvailablePage: {
        type: Boolean,
        default: false
      },
      perPage: {
        type: Number,
        default: 24
      },
      perRow: {
        type: Number,
        default: 4
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
        currentResults: this.results,
        currentSelectedFacets: this.selectedFacets,
        currentTotalResults: this.totalResults
      };
    },
    computed: {
      apiQuery() {
        return {
          page: this.page,
          rows: this.perPage,
          qf: (this.hiddenSearchParams.qf || []).concat(this.qf),
          query: this.query,
          reusability: this.reusability,
          wskey: process.env.EUROPEANA_API_KEY
        };
      },
      contentTierActiveState() {
        return this.selectedFacets.contentTier && this.selectedFacets.contentTier.includes('*');
      },
      errorMessage() {
        if (!this.currentError) return null;

        const paginationError = this.currentError.match(/It is not possible to paginate beyond the first (\d+)/);
        if (paginationError !== null) {
          const localisedPaginationLimit = this.$options.filters.localise(Number(paginationError[1]));
          return this.$t('messages.paginationLimitExceeded', { limit: localisedPaginationLimit });
        }

        return this.currentError;
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
       * Sort the facets for display
       * Facets are returned in the hard-coded preferred order from the search
       * plugin, followed by all others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets() {
        let unordered = this.currentFacets.slice();
        let ordered = [];

        for (const facetName of defaultFacets) {
          const index = unordered.findIndex((f) => {
            return f.name === facetName;
          });
          if (index !== -1) {
            ordered = ordered.concat(unordered.splice(index, 1));
          }
        }

        return ordered.concat(unordered);
      },
      page: {
        get() {
          return this.$store.state.search.page;
        },
        set(value) {
          this.$store.commit('search/setPage', value);
        }
      },
      qf() {
        let qfForSelectedFacets = [];
        for (const facetName in this.currentSelectedFacets) {
          const selectedValues = this.currentSelectedFacets[facetName];
          // `reusability` has its own API parameter and can not be queried in `qf`
          if (facetName !== 'REUSABILITY') {
            for (const facetValue of selectedValues) {
              if (defaultFacets.includes(facetName)) {
                qfForSelectedFacets.push(`${facetName}:"${facetValue}"`);
              } else {
                qfForSelectedFacets.push(`${facetName}:${facetValue}`);
              }
            }
          }
        }
        return qfForSelectedFacets;
      },
      query() {
        return this.$store.state.search.query;
      },
      reusability() {
        if (this.currentSelectedFacets['REUSABILITY'] && this.currentSelectedFacets['REUSABILITY'].length > 0) {
          return this.currentSelectedFacets['REUSABILITY'].join(',');
        } else {
          return undefined;
        }
      },
      showPagination() {
        return this.currentTotalResults > this.perPage;
      },
      view() {
        return this.$store.getters['search/activeView'];
      }
    },
    watch: {
      apiQuery: {
        deep: true,
        handler() {
          Vue.nextTick(() => {
            this.rerouteSearch(this.updateCurrentSearchQuery());
            this.updateResults();
          });
        }
      }
    },
    created() {
      if (this.$route.query.view) {
        this.$store.commit('search/setView', this.$route.query.view);
      }
    },
    methods: {
      changeContentTierToggle() {
        this.currentSelectedFacets = selectedFacetsFromQuery(this.$route.query);
        this.page = 1;
      },
      changeFacet(name, selected) {
        this.$set(this.currentSelectedFacets, name, selected);
        this.page = 1;
      },
      changePage(page) {
        this.page = page;
      },
      paginationLink(val) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ page: val }) } });
      },
      rerouteSearch(queryUpdates) {
        this.$router.push(this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery(queryUpdates) } }));
      },
      updateCurrentSearchQuery(updates = {}) {
        const current = {
          page: this.page,
          qf: this.qf,
          query: this.query,
          reusability: this.reusability,
          view: this.view
        };

        const updated = { ...current, ...updates };

        // If any updated values are `null`, remove them from the query
        for (const key in updated) {
          if (updated[key] === null) {
            delete updated[key];
          }
        }
        return updated;
      },
      updateResults() {
        search(this.apiQuery)
          .then((response) => {
            this.currentError = response.error;
            this.currentFacets = response.facets;
            this.currentResults = response.results;
            this.currentTotalResults = response.totalResults;
            // TODO: make last available page a computed method in this component?
            this.currentLastAvailablePage = response.lastAvailablePage;
          })
          .catch((error) => {
            this.currentError = error.message;
            this.currentResults = [];
            this.currentFacets = [];
            this.currentTotalResults = 0;
          });
      }
    }
  };
</script>
