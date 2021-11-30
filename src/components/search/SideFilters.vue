<template>
  <b-col
    class="col-filters col-3"
    :class="{ open: showFiltersSheet, hide: hideFilterSheet }"
  >
    <div
      class="filters-backdrop"
      @click="toggleFilterSheet"
    />
    <b-container
      class="side-filters"
    >
      <b-row
        class="border-bottom border-top d-flex justify-content-between align-items-center"
      >
        <h2 class="filters-title">
          {{ $t('filterResults') }}
        </h2>
        <button
          v-if="isFilteredByDropdowns()"
          class="btn btn-outline-primary mr-3"
          data-qa="reset filters button"
          @click="resetFilters"
        >
          {{ $t('reset') }}
        </button>
        <b-button
          data-qa="close filters button"
          class="close"
          :aria-label="$t('header.closeSidebar')"
          @click="toggleFilterSheet"
        />
      </b-row>
      <b-row class="mb-3 mt-4">
        <b-col
          data-qa="search filters"
        >
          <div class="position-relative">
            <template
              v-if="collection === 'newspaper'"
            >
              <SideDateFilter
                :name="PROXY_DCTERMS_ISSUED"
                :start="dateFilter.start"
                :end="dateFilter.end"
                :specific="dateFilter.specific"
                @dateFilter="dateFilterSelected"
              />
            </template>
            <client-only>
              <SideFacetDropdown
                v-for="facet in filterableFacets"
                :key="facet.name"
                :name="facet.name"
                :type="facetDropdownType(facet.name)"
                :selected="filters[facet.name]"
                :static-fields="facet.staticFields"
                role="search"
                @changed="changeFacet"
              />
            </client-only>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-col>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import isEqual from 'lodash/isEqual';
  import { mapState, mapGetters } from 'vuex';
  import { thematicCollections, rangeToQueryParam, rangeFromQueryParam } from '@/plugins/europeana/search';
  import { queryUpdatesForFilters } from '../../store/search';
  import SideFacetDropdown from './SideFacetDropdown';

  export default {
    name: 'SideFilters',

    components: {
      ClientOnly,
      SideFacetDropdown,
      SideDateFilter: () => import('./SideDateFilter')
    },
    props: {
      route: {
        type: Object,
        default: () => {
          return { name: 'search' };
        }
      }
    },
    data() {
      return {
        PROXY_DCTERMS_ISSUED: 'proxy_dcterms_issued',
        API_FILTER_COLLECTIONS: ['newspaper', 'ww1'],
        hideFilterSheet: true
      };
    },
    computed: {
      ...mapState({
        collectionFacetEnabled: state => state.search.collectionFacetEnabled,
        facets: state => state.search.facets,
        resettableFilters: state => state.search.resettableFilters,
        showFiltersSheet: state => state.search.showFiltersSheet,
        userParams: state => state.search.userParams
      }),
      ...mapGetters({
        facetNames: 'search/facetNames',
        filters: 'search/filters',
        queryUpdatesForFacetChanges: 'search/queryUpdatesForFacetChanges',
        collection: 'search/collection'
      }),
      filterableFacets() {
        const facets = this.facetNames.map(facetName => ({
          name: facetName
        }));

        if (this.enableApiFilter) {
          facets.unshift({
            name: 'api',
            staticFields: ['fulltext', 'metadata']
          });
        }
        if (this.collectionFacetEnabled) {
          facets.unshift({
            name: 'collection',
            staticFields: thematicCollections
          });
        }

        return facets;
      },
      qf() {
        return this.userParams.qf;
      },
      query() {
        return this.userParams.query;
      },
      reusability() {
        return this.userParams.reusability;
      },
      api() {
        return this.userParams.api;
      },
      page() {
        // This causes double jumps on pagination when using the > arrow, for some reason
        // return this.userParams.page;

        // This is a workaround
        return Number(this.$route.query.page || 1);
      },
      enableApiFilter() {
        return this.API_FILTER_COLLECTIONS.includes(this.collection);
      },
      dateFilter() {
        const proxyDctermsIssued = this.filters[this.PROXY_DCTERMS_ISSUED];
        if (!proxyDctermsIssued || proxyDctermsIssued.length < 1) {
          return { start: null, end: null, specific: this.isCheckedSpecificDate };
        }
        const range = rangeFromQueryParam(proxyDctermsIssued[0]);
        if (!range) {
          return { start: proxyDctermsIssued[0], end: null, specific: true };
        }
        return range;
      }
    },
    watch: {
      showFiltersSheet(newVal) {
        if (newVal) {
          this.hideFilterSheet = false;
        } else {
          setTimeout(() => this.hideFilterSheet = true, 300);
        }
      }
    },
    created() {
      this.$store.commit('search/setShowFiltersToggle', true);
    },
    beforeDestroy() {
      this.$store.commit('search/setShowFiltersToggle', false);
    },
    methods: {
      facetDropdownType(name) {
        return name === 'collection' || name === 'api' ? 'radio' : 'checkbox';
      },
      changeFacet(name, selected) {
        if (typeof this.filters[name] === 'undefined') {
          if ((Array.isArray(selected) && selected.length === 0) || !selected) {
            return;
          }
        }
        if (isEqual(this.filters[name], selected)) {
          return;
        }

        this.rerouteSearch(this.queryUpdatesForFacetChanges({ [name]: selected }));
      },
      rerouteSearch(queryUpdates) {
        const query = this.updateCurrentSearchQuery(queryUpdates);
        this.$goto(this.$path({ ...this.route, ...{ query } }));
        if (queryUpdates.qf) {
          queryUpdates.qf.forEach(filter =>
            this.$matomo && this.$matomo.trackEvent('Filters', 'Filter selected', filter)
          );
        }
        if (queryUpdates.reusability) {
          this.$matomo && this.$matomo.trackEvent('Filters', 'Reusability filter selected', queryUpdates.reusability);
        }
      },
      updateCurrentSearchQuery(updates = {}) {
        const current = {
          page: this.page,
          qf: this.qf,
          query: this.query,
          reusability: this.reusability,
          view: this.view,
          api: this.api
        };

        const updated = { ...current, ...updates };

        for (const key in updated) {
          // If any updated values are `null`, remove them from the query
          if (updated[key] === null) {
            delete updated[key];
          }
        }

        return updated;
      },
      resetFilters() {
        const filters = Object.assign({}, this.filters);

        for (const filterName of this.resettableFilters) {
          filters[filterName] = [];
        }
        this.$store.commit('search/clearResettableFilters');
        return this.rerouteSearch(queryUpdatesForFilters(filters));
      },
      isFilteredByDropdowns() {
        return this.$store.getters['search/hasResettableFilters'];
      },
      dateFilterSelected(facetName, dateRange) {
        let dateQuery = [];
        if (dateRange.specific) {
          if (dateRange.start) {
            dateQuery = [dateRange.start];
          }
        } else if (dateRange.start || dateRange.end) {
          dateQuery = [rangeToQueryParam(dateRange)];
        }
        this.isCheckedSpecificDate = dateRange.specific;
        this.changeFacet(facetName, dateQuery);
      },
      toggleFilterSheet() {
        this.$store.commit('search/setShowFiltersSheet', !this.$store.state.search.showFiltersSheet);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import '@/assets/scss/icons.scss';
  .filters-title {
    font-size: $font-size-small;
    font-weight: 600;
    line-height: 1;
    margin: 1.25rem 1rem;
  }
  .col-filters {
    @media (max-width: $bp-large - 1px) {
      display: flex;
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      padding-top: 1rem;
      transition: right 300ms ease-in-out;
      z-index: 1050;
      max-width: none;
      overflow: hidden;
      .side-filters {
        flex-shrink: 0;
        margin-right: -320px;
        overflow-y: auto;
        width: 320px;
        max-width: 75vw;
        animation: appear 300ms ease-in-out;
        transition: margin-right 300ms ease-in-out;
        @keyframes appear {
          from {
            margin-right: -320px;
          }
          to {
            margin-right: 0;
          }
        }
      }
      &.hide {
        display: none;
      }
      &.open {
        left: 0;
        .side-filters {
          margin-right: 0;
        }
        .filters-backdrop {
          content: '';
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
        }
      }
    }
    @media (min-width: $bp-large) {
      max-width: 320px;
      min-width: 220px;
      min-height: 31rem;
      &::after {
        border-top: 145px solid $white;
        border-left: 60px solid transparent;
        content: '';
        display: block;
        height: 0;
        position: absolute;
        right: 0;
        top: 100%;
        width: 0;
        z-index: 1;
      }
      .filters-backdrop {
        display: none;
      }
    }
    flex-grow: 0;
    padding: 0;
    margin-top: -1rem;
    .side-filters {
      background-color: $white;
      height: 100%;
    }
    .btn.close {
      @media (min-width: $bp-large) {
        display: none;
      }
      background: none;
      border-radius: 0;
      border: 0;
      box-shadow: none;
      color: $black;
      font-size: 1rem;
      padding: 0 15px;
      opacity: 1;
      height: 3.5rem;
      transition: $standard-transition;
      &:before {
        @extend .icon-font;
        display: inline-block;
        content: '\e931';
        font-weight: 400;
        font-size: 1.5rem;
      }
      &:hover {
        color: $blue;
        transition: $standard-transition;
      }
    }
  }
</style>
