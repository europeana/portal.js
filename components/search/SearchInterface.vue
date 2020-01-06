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
          <SearchFilters
            :filters="filters"
          />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col
          data-qa="search filters"
        >
          <FacetDropdown
            v-for="facet in coreFacets"
            :key="facet.name"
            :name="facet.name"
            :fields="facet.fields"
            :type="facetDropdownType(facet.name)"
            :selected="filters[facet.name]"
            @changed="changeFacet"
          />
          <MoreFiltersDropdown
            v-if="enableMoreFacets"
            :more-facets="moreFacets"
            :selected="moreSelectedFacets"
            @changed="changeMoreFacets"
          />
          <button
            v-if="isFilteredByDropdowns()"
            class="reset"
            data-qa="reset filters button"
            @click="resetFilters"
          >
            {{ $t('reset') }}
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
  import MoreFiltersDropdown from '../../components/search/MoreFiltersDropdown';
  import SearchFilters from '../../components/search/SearchFilters';
  import PaginationNav from '../../components/generic/PaginationNav';
  import ViewToggles from '../../components/search/ViewToggles';
  import TierToggler from '../../components/search/TierToggler';
  import { defaultFacetNames, unquotableFacets, thematicCollections } from '../../plugins/europeana/search';

  import isEqual from 'lodash/isEqual';
  import pickBy from 'lodash/pickBy';
  import { mapState } from 'vuex';

  export default {
    components: {
      AlertMessage,
      InfoMessage,
      FacetDropdown,
      MoreFiltersDropdown,
      SearchResults,
      SearchFilters,
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
    data() {
      return {
        coreFacetNames: ['THEME', 'TYPE', 'COUNTRY', 'REUSABILITY'],
        PROXY_DCTERMS_ISSUED: 'proxy_dcterms_issued',
        THEME: 'THEME'
      };
    },
    computed: {
      ...mapState({
        entityId: state => state.entity.id,
        error: state => state.search.error,
        facets: state => state.search.facets,
        lastAvailablePage: state => state.search.lastAvailablePage,
        // This causes double jumps on pagination when using the > arrow, for some reason
        // page: state => state.search.page,
        qf: state => state.search.qf,
        query: state => state.search.query,
        results: state => state.search.results,
        reusability: state => state.search.reusability,
        theme: state => state.search.theme,
        filters: state => state.search.filters,
        totalResults: state => state.search.totalResults
      }),
      // workaround for double jump mentioned in store mapState call above
      page() {
        return Number(this.$route.query.page || 1);
      },
      contentTierActiveState() {
        return this.filters.contentTier && this.filters.contentTier.includes('*');
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

        for (const facetName of defaultFacetNames) {
          const index = unordered.findIndex((f) => {
            return f.name === facetName;
          });
          if (index !== -1) {
            ordered = ordered.concat(unordered.splice(index, 1));
          }
        }

        if (this.$store.state.search.themeFacetEnabled) {
          ordered.unshift({ name: this.THEME, fields: thematicCollections });
        }
        return ordered.concat(unordered);
      },
      coreFacets() {
        return this.orderedFacets.filter(facet => this.coreFacetNames.includes(facet.name));
      },
      moreFacetNames() {
        return defaultFacetNames.filter(facetName => !this.coreFacetNames.includes(facetName));
      },
      moreFacets() {
        return this.orderedFacets.filter(facet => this.moreFacetNames.includes(facet.name));
      },
      moreSelectedFacets() {
        return pickBy(this.filters, (selected, name) => this.moreFacetNames.includes(name) || name === this.PROXY_DCTERMS_ISSUED);
      },
      dropdownFilterNames() {
        return defaultFacetNames.concat(this.PROXY_DCTERMS_ISSUED, this.THEME);
      },
      enableMoreFacets() {
        return this.moreFacets.length > 0;
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
      facetDropdownType(name) {
        return name === 'THEME' ? 'radio' : 'checkbox';
      },
      changeFacet(name, selected) {
        if (typeof this.filters[name] === 'undefined') {
          if ((Array.isArray(selected) && selected.length === 0) || !selected) return;
        }
        if (isEqual(this.filters[name], selected)) return;
        this.rerouteSearch(this.queryUpdatesForFacetChanges({ [name]: selected }));
      },
      changeMoreFacets(selected) {
        this.rerouteSearch(this.queryUpdatesForFacetChanges(selected));
      },
      paginationLink(val) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ page: val }) } });
      },
      rerouteSearch(queryUpdates) {
        this.$router.push(this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery(queryUpdates) } }));
      },
      queryUpdatesForFacetChanges(selected) {
        let filters = Object.assign({}, this.filters);

        for (const name in selected) {
          filters[name] = selected[name];
        }

        return this.queryUpdatesForFilters(filters);
      },
      queryUpdatesForFilters(filters) {
        let queryUpdates = {
          qf: [],
          page: 1
        };

        for (const facetName in filters) {
          const selectedValues = filters[facetName];
          // `reusability` has its own API parameter and can not be queried in `qf`
          if (facetName === 'REUSABILITY') {
            if (selectedValues.length > 0) {
              queryUpdates.reusability = selectedValues.join(',');
            } else {
              queryUpdates.reusability = null;
            }
          } else if (facetName === 'THEME') {
            queryUpdates.theme = selectedValues;
          } else {
            for (const facetValue of selectedValues) {
              const quotedValue = this.enquoteFacet(facetName) ? `"${facetValue}"` : facetValue;
              queryUpdates.qf.push(`${facetName}:${quotedValue}`);
            }
          }
        }
        return queryUpdates;
      },
      enquoteFacet(facetName) {
        return defaultFacetNames.includes(facetName) && !unquotableFacets.includes(facetName);
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
      resetFilters() {
        const filters = Object.assign({}, this.filters);

        for (const filterName of this.dropdownFilterNames) {
          filters[filterName] = [];
        }
        this.rerouteSearch(this.queryUpdatesForFilters(filters));
      },
      isFilteredByDropdowns() {
        for (const filterName of this.dropdownFilterNames) {
          if (Object.prototype.hasOwnProperty.call(this.filters, filterName)) {
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

  .reset {
    background: none;
    border: none;
    color: $black;
    font-size: $font-size-small;
    text-transform: uppercase;
  }
</style>
