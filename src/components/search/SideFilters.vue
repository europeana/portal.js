<template>
  <b-container
    class="side-filters"
  >
    <b-row
      class="filter-title-row"
    >
      <h2 class="filters-title">
        {{ $t('filterResults') }}
      </h2>
    </b-row>
    <b-row class="mb-3 mt-4">
      <b-col
        data-qa="search filters"
      >
        <client-only>
          <div class="position-relative">
            <FacetDropdown
              v-for="facet in orderedFacets"
              :key="facet.name"
              :name="facet.name"
              :fields="facet.fields"
              :type="facetDropdownType(facet.name)"
              :selected="filters[facet.name]"
              role="search"
              @changed="changeFacet"
            />
            <b-row class="reset-container">
              <button
                v-if="isFilteredByDropdowns()"
                class="btn btn-outline-primary"
                data-qa="reset filters button"
                @click="resetFilters"
              >
                {{ $t('reset') }}
              </button>
            </b-row>
          </div>
        </client-only>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import isEqual from 'lodash/isEqual';
  import { mapState, mapGetters } from 'vuex';
  import { thematicCollections } from '@/plugins/europeana/search';
  import { queryUpdatesForFilters } from '../../store/search';
  import FacetDropdown from './FacetDropdown';

  export default {
    name: 'SideFilters',

    components: {
      ClientOnly,
      FacetDropdown
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
        coreFacetNames: ['collection', 'TYPE', 'COUNTRY', 'REUSABILITY'],
        PROXY_DCTERMS_ISSUED: 'proxy_dcterms_issued'
      };
    },
    computed: {
      ...mapState({
        userParams: state => state.search.userParams,
        facets: state => state.search.facets,
        resettableFilters: state => state.search.resettableFilters
      }),
      ...mapGetters({
        facetNames: 'search/facetNames',
        filters: 'search/filters',
        queryUpdatesForFacetChanges: 'search/queryUpdatesForFacetChanges',
        collection: 'search/collection'
      }),
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
      /**
       * Sort the facets for display
       * Facets are returned in the hard-coded preferred order from the search
       * plugin, followed by all others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets() {
        const unordered = this.facets.slice();
        let ordered = [];

        for (const facetName of this.facetNames) {
          const index = unordered.findIndex((f) => {
            return f.name === facetName;
          });
          if (index !== -1) {
            ordered = ordered.concat(unordered.splice(index, 1));
          }
        }

        if (this.$store.state.search.collectionFacetEnabled) {
          ordered.unshift({ name: 'collection', fields: thematicCollections });
        }
        return ordered.concat(unordered);
      }
    },
    methods: {
      facetDropdownType(name) {
        return name === 'collection' ? 'radio' : 'checkbox';
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  .reset {
    background: none;
    border: none;
    color: $black;
    font-size: $font-size-small;
    text-transform: uppercase;
  }
  .filter-title-row {
    border-bottom: 1px solid $middlegrey;
  }
  .filters-title {
    font-size: $font-size-small;
    font-weight: 600;
    line-height: 1;
    margin: 1.25rem 0;
    padding: 0 15px;
  }
  .reset-container {
    padding: 0.75rem 15px;
    background-color: $lightgrey;
    .btn-outline-primary {
      background-color: $white;
      width: 50%;
    }
  }
</style>
