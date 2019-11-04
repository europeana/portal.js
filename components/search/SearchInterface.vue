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
            :facets="selectedFacets"
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
            :selected="selectedFacets[facet.name]"
            @changed="changeFacet"
          />
          <button
            v-if="isFilteredByDefaultFacets()"
            class="clear-all"
            data-qa="clear filters button"
            :disabled="disableClearAllButton"
            @click="clearFilters"
          >
            {{ $t('clearAllFilters') }}
          </button>
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
            {{ $t('results') }}: {{ totalResults | localise }}
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
                v-model="results"
                :view="view"
                :per-row="perRow"
              />
              <InfoMessage
                v-if="lastAvailablePage"
                :message="$t('resultsLimitWarning')"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <TierToggler
                v-if="tierToggleEnabled && showContentTierToggle"
                :active-state="contentTierActiveState"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <PaginationNav
                v-if="showPagination"
                v-model="page"
                :total-results="totalResults"
                :per-page="perPage"
                :link-gen="paginationLink"
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
  import SearchResults from '../../components/search/SearchResults'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../../components/generic/InfoMessage';
  import FacetDropdown from '../../components/search/FacetDropdown';
  import SearchSelectedFacets from '../../components/search/SearchSelectedFacets';
  import PaginationNav from '../../components/generic/PaginationNav';
  import ViewToggles from '../../components/search/ViewToggles';
  import TierToggler from '../../components/search/TierToggler';
  import { defaultFacets } from '../../plugins/europeana/search';

  import isEqual from 'lodash/isEqual';
  import { mapState } from 'vuex';

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
    props: {
      perPage: {
        type: Number,
        default: 24
      },
      perRow: {
        type: Number,
        default: 4
      },
      route: {
        type: Object,
        default: () => {
          return { name: 'search' };
        }
      },
      showContentTierToggle: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState({
        error: state => state.search.error,
        facets: state => state.search.facets,
        lastAvailablePage: state => state.search.lastAvailablePage,
        // This causes double jumps on pagination when using the > arrow, for some reason
        // page: state => state.search.page,
        qf: state => state.search.qf,
        query: state => state.search.query,
        results: state => state.search.results,
        reusability: state => state.search.reusability,
        selectedFacets: state => state.search.selectedFacets,
        totalResults: state => state.search.totalResults,
        disableClearAllButton: state => state.search.disableClearAllButton
      }),
      // workaround for double jump mentioned in store mapState call above
      page() {
        return Number(this.$route.query.page || 1);
      },
      contentTierActiveState() {
        return this.selectedFacets.contentTier && this.selectedFacets.contentTier.includes('*');
      },
      errorMessage() {
        if (!this.error) return null;

        const paginationError = this.error.match(/It is not possible to paginate beyond the first (\d+)/);
        if (paginationError !== null) {
          const localisedPaginationLimit = this.$options.filters.localise(Number(paginationError[1]));
          return this.$t('messages.paginationLimitExceeded', { limit: localisedPaginationLimit });
        }

        return this.error;
      },
      hasAnyResults() {
        return this.totalResults > 0;
      },
      noMoreResults() {
        return this.hasAnyResults && this.results.length === 0;
      },
      noResults() {
        return this.totalResults === 0;
      },
      /**
       * Sort the facets for display
       * Facets are returned in the hard-coded preferred order from the search
       * plugin, followed by all others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets() {
        let unordered = this.facets.slice();
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
      showPagination() {
        return this.totalResults > this.perPage;
      },
      tierToggleEnabled() {
        return Boolean(Number(process.env['ENABLE_CONTENT_TIER_TOGGLE']));
      },
      view() {
        return this.$store.getters['search/activeView'];
      }
    },
    created() {
      if (this.$route.query.view) {
        this.$store.commit('search/setView', this.$route.query.view);
      }
    },
    methods: {
      changeFacet(name, selected) {
        if (typeof this.selectedFacets[name] === 'undefined' && selected.length === 0) return;
        if (isEqual(this.selectedFacets[name], selected)) return;
        this.rerouteSearch(this.queryUpdatesForFacetChange(name, selected));
      },
      paginationLink(val) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ page: val }) } });
      },
      rerouteSearch(queryUpdates) {
        this.$router.push(this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery(queryUpdates) } }));
      },
      queryUpdatesForFacetChange(name, selected) {
        let selectedFacets = Object.assign({}, this.selectedFacets);
        selectedFacets[name] = selected;

        return this.queryUpdatesForSelectedFacets(selectedFacets);
      },
      queryUpdatesForSelectedFacets(selectedFacets) {
        let queryUpdates = {
          qf: [],
          page: 1
        };

        for (const facetName in selectedFacets) {
          const selectedValues = selectedFacets[facetName];
          // `reusability` has its own API parameter and can not be queried in `qf`
          if (facetName === 'REUSABILITY') {
            if (selectedValues.length > 0) {
              queryUpdates.reusability = selectedValues.join(',');
            } else {
              queryUpdates.reusability = null;
            }
          } else {
            for (const facetValue of selectedValues) {
              if (defaultFacets.includes(facetName)) {
                queryUpdates.qf.push(`${facetName}:"${facetValue}"`);
              } else {
                queryUpdates.qf.push(`${facetName}:${facetValue}`);
              }
            }
          }
        }
        return queryUpdates;
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
      clearFilters() {
        const selectedFacets = Object.assign({}, this.selectedFacets);

        for (const facetName of defaultFacets) {
          selectedFacets[facetName] = [];
        }
        this.rerouteSearch(this.queryUpdatesForSelectedFacets(selectedFacets));
      },
      isFilteredByDefaultFacets() {
        for (const facetName of defaultFacets) {
          if (Object.prototype.hasOwnProperty.call(this.selectedFacets, facetName)) {
            return true;
          }
        }
        return false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";
  @import "./assets/scss/icons.scss";

  .clear-all {
    background: none;
    border: none;
    color: $blue;

    &:before {
      content: '\e903';
      @extend .icon-font;
    }

    &:disabled {
      opacity: .4;
      color: $grey;
    }
  }
</style>
