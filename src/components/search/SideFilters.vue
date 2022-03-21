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
      data-qa="side filters"
    >
      <client-only>
        <b-row
          class="border-bottom border-top d-flex justify-content-between align-items-center flex-nowrap"
        >
          <div
            v-if="entityHeaderCardsEnabled && totalResults"
            class="filters-title"
            data-qa="total results"
          >
            {{ $tc('items.itemCount', totalResultsLocalised, { count: totalResultsLocalised }) }}
            <div
              class="visually-hidden"
              role="status"
            >
              {{ $t('searchHasLoaded', [totalResultsLocalised]) }}
            </div>
          </div>
          <h2
            v-else
            class="filters-title"
          >
            {{ $t('filterResults') }}
          </h2>
          <button
            v-if="hasResettableFilters()"
            :disabled="resetButtonDisabled"
            class="btn btn-outline-primary mr-3"
            data-qa="reset filters button"
            @click="resetFilters"
          >
            {{ $t('reset') }}
          </button>
          <b-button
            data-qa="close filters button"
            class="button-icon-only icon-clear mx-3"
            variant="light-flat"
            :aria-label="$t('header.closeSidebar')"
            @click="toggleFilterSheet"
          />
        </b-row>
        <b-row class="mb-3 mt-4">
          <b-col
            data-qa="search filters"
          >
            <div class="position-relative">
              <SideSwitchFilter
                v-if="enableApiFilter"
                :value="filters.api"
                name="api"
                :label="$t('facets.api.switch')"
                :tooltip="$t('facets.api.switchMoreInfo')"
                checked-value="fulltext"
                unchecked-value="metadata"
                :default-value="apiFilterDefaultValue"
                @changed="changeFacet"
              />
              <SideDateFilter
                v-if="enableDateFilter"
                :name="dateFilterField"
                :start="dateFilter.start"
                :end="dateFilter.end"
                :specific="dateFilter.specific"
                @dateFilter="dateFilterSelected"
              />
              <SideFacetDropdown
                v-for="facet in filterableFacets"
                :key="facet.name"
                :name="facet.name"
                :type="facetDropdownType(facet.name)"
                :selected="filters[facet.name]"
                :static-fields="facet.staticFields"
                :group-by="sideFacetDropdownGroupBy(facet.name)"
                role="search"
                :aria-label="facet.name"
                @changed="changeFacet"
              />
              <SideSwitchFilter
                v-if="contentTierFacetSwitch"
                :value="filters.contentTier"
                name="contentTier"
                :label="$t('facets.contentTier.options.0')"
                checked-value="&quot;0&quot;"
                :unchecked-value="null"
                :default-value="null"
                @changed="changeFacet"
              />
            </div>
          </b-col>
        </b-row>
      </client-only>
    </b-container>
  </b-col>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import isEqual from 'lodash/isEqual';
  import { mapState, mapGetters } from 'vuex';
  import { rangeToQueryParam, rangeFromQueryParam, filtersFromQf } from '@/plugins/europeana/search';
  import themes from '@/plugins/europeana/themes';
  import { defaultFacetNames } from '@/store/search';
  import SideFacetDropdown from './SideFacetDropdown';

  export default {
    name: 'SideFilters',

    components: {
      ClientOnly,
      SideFacetDropdown,
      SideDateFilter: () => import('./SideDateFilter'),
      SideSwitchFilter: () => import('./SideSwitchFilter')
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
        DEFAULT_FACET_NAMES: defaultFacetNames,
        hideFilterSheet: true
      };
    },
    computed: {
      ...mapState({
        collectionFacetEnabled: state => state.search.collectionFacetEnabled,
        showFiltersSheet: state => state.search.showFiltersSheet,
        totalResults: state => state.search.totalResults,
        userParams: state => state.search.userParams
      }),
      ...mapGetters({
        collection: 'search/collection'
      }),
      // TODO: do not assume filters are fielded, e.g. `qf=whale`
      filters() {
        const filters = filtersFromQf(this.$store.state.search.userParams?.qf);

        if (this.$store.state.search.userParams?.reusability) {
          filters['REUSABILITY'] = this.$store.state.search.userParams.reusability.split(',');
        }

        if (this.$store.state.search.apiParams?.api) {
          filters['api'] = this.$store.state.search.apiParams.api;
        }

        return filters;
      },
      resettableFilters() {
        const filters = this.filterableFacets
          .map(facet => facet.name)
          .filter(name => this.filters[name]);

        if (this.contentTierFacetSwitch && this.filters.contentTier) {
          filters.push('contentTier');
        }
        if (this.enableApiFilter && (this.filters.api !== this.apiFilterDefaultValue)) {
          filters.push('api');
        }
        if (this.enableDateFilter && this.filters[this.dateFilterField]) {
          filters.push(this.dateFilterField);
        }

        return filters;
      },
      theme() {
        return themes.find(theme => theme.qf === this.collection);
      },
      themeSpecificFacetNames() {
        return (this.theme?.facets || []).map((facet) => facet.field);
      },
      facetNames() {
        return this.themeSpecificFacetNames.concat(this.DEFAULT_FACET_NAMES);
      },
      resetButtonDisabled() {
        // Disable reset button while queries are running
        return this.$store.state.search.liveQueries.length > 0;
      },
      filterableFacets() {
        let facets = this.facetNames.map(facetName => ({
          name: facetName
        }));

        if (this.collectionFacetEnabled) {
          facets.unshift({
            name: 'collection',
            staticFields: themes.map(theme => theme.qf)
          });
        }

        if (this.contentTierFacetSwitch) {
          facets = facets.filter((facet) => facet.name !== 'contentTier');
        }

        return facets;
      },
      contentTierFacetSwitch() {
        return !this.$store.getters['search/collection'] && !this.$store.getters['entity/id'];
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
      view() {
        return this.userParams.view;
      },
      page() {
        // This causes double jumps on pagination when using the > arrow, for some reason
        // return this.userParams.page;

        // This is a workaround
        return Number(this.$route.query.page || 1);
      },
      enableApiFilter() {
        return !!this.theme?.filters?.api;
      },
      apiFilterDefaultValue() {
        return this.theme?.filters?.api?.default || null;
      },
      enableDateFilter() {
        return !!this.theme?.filters?.date;
      },
      dateFilterField() {
        return this.theme?.filters?.date?.field || null;
      },
      dateFilter() {
        const dateFilterValue = this.filters[this.dateFilterField];

        if (!dateFilterValue || dateFilterValue.length < 1) {
          return { start: null, end: null, specific: this.isCheckedSpecificDate };
        }

        const range = rangeFromQueryParam(dateFilterValue[0]);

        return range ? { ...range, specific: false } : { start: dateFilterValue[0], end: null, specific: true };
      },
      entityHeaderCardsEnabled() {
        return this.$features.entityHeaderCards;
      },
      totalResultsLocalised() {
        return this.$options.filters.localise(this.totalResults);
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
      queryUpdatesForFacetChanges(selected = {}) {
        const filters = Object.assign({}, this.filters);

        for (const name in selected) {
          filters[name] = selected[name];
        }

        // Remove collection-specific filters when collection is changed
        if (Object.prototype.hasOwnProperty.call(selected, 'collection') || !this.collection) {
          for (const name in filters) {
            if (name !== 'collection' && !defaultFacetNames.includes(name) && this.resettableFilters.includes(name)) {
              filters[name] = [];
            }
          }
        }

        // Remove filters incompatible with change of collection filter
        if (Object.prototype.hasOwnProperty.call(selected, 'collection') && Object.prototype.hasOwnProperty.call(filters, 'contentTier')) {
          filters['contentTier'] = [];
        }

        return this.queryUpdatesForFilters(filters);
      },
      queryUpdatesForFilters(filters) {
        const queryUpdates = {
          qf: [],
          page: 1
        };

        for (const name in filters) {
          switch (name) {
          case 'REUSABILITY':
            // `reusability` has its own API parameter and can not be queried in `qf`
            queryUpdates.reusability = filters[name].length > 0 ? filters[name].join(',') : null;
            break;
          case 'api':
            // `api` is an option to /plugins/europeana/search/search()
            queryUpdates.api = filters[name];
            break;
          default:
            // Everything else goes in `qf`
            queryUpdates.qf = queryUpdates.qf.concat(this.queryUpdatesForFilter(name, filters[name]));
          }
        }
        return queryUpdates;
      },
      queryUpdatesForFilter(name, values) {
        return [].concat(values)
          .filter((value) => (value !== undefined) && (value !== null))
          .map((value) => `${name}:${value}`);
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
        return this.rerouteSearch(this.queryUpdatesForFilters(filters));
      },
      hasResettableFilters() {
        return this.resettableFilters.length > 0;
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
      },
      sideFacetDropdownGroupBy(facetName) {
        if (facetName === 'RIGHTS') {
          return [
            '/CNE/',
            '/InC-EDU/',
            '/InC-OW-EU/',
            '/InC/',
            '/licenses/by-nc-nd/',
            '/licenses/by-nc-sa/',
            '/licenses/by-nc/',
            '/licenses/by-nd/',
            '/licenses/by-sa/',
            '/licenses/by/',
            '/NoC-NC/',
            '/NoC-OKLR/',
            '/publicdomain/mark/',
            '/publicdomain/zero/',
            '/rights/out-of-copyright-non-commercial/',
            '/rights/rr-f/',
            '/rights/unknown/'
          ];
        } else {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

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
          background-color: rgb(0 0 0 / 70%);
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

    .icon-clear {
      @media (min-width: $bp-large) {
        display: none;
      }
    }
  }

  .form-group {
    margin-bottom: 1.5rem;
  }
</style>
