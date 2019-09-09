<template>
  <b-container>
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
          :link-gen="viewToggleLink"
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
                v-if="showPagination"
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
                v-if="results.length === 0"
                data-qa="warning notice"
              >
                {{ $t('noMoreResults') }}
              </p>
              <SearchResultsList
                v-else-if="view === 'list'"
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
              <TierToggler
                v-if="showContentTierToggle"
                :active-state="contentTierActiveState"
                @toggle="selectFacet"
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
  import TierToggler from '../../components/search/TierToggler';

  const thematicCollections = ['all', 'ww1',  'archaeology', 'art', 'fashion', 'manuscript', 'map', 'migration', 'music', 'nature', 'newspaper', 'photography', 'sport'];

  let watchList = {};
  for (const property of ['qf', 'query', 'reusability', 'view', 'theme']) {
    watchList[property] = {
      immediate: true,
      handler(val) {
        this.$root.$emit('updateSearchQuery', this.updateCurrentSearchQuery({ [property]: val }));
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
        facetDisplayOrder: ['TYPE', 'REUSABILITY', 'COUNTRY'],
        isLoading: false,
        qfForSelectedFacets: [],
        reusability: null,
        selectedFacets: {},
        theme: null,
        view: this.selectedView()
      };
    },
    computed: {
      contentTierActiveState() {
        return Object.prototype.hasOwnProperty.call(this.selectedFacets, 'contentTier') && this.selectedFacets['contentTier'].includes('*');
      },
      hasResults() {
        return this.results.length > 0 && this.totalResults > 0;
      },
      /**
       * Sort the facets from the API response
       * Facets are returned in the hard-coded preferred order, followed by all
       * others in the order the API returned them.
       * @return {Object[]} ordered facets
       * TODO: does this belong in its own component?
       */
      orderedFacets() {
        if (!this.facets) {
          return [];
        }
        let unordered = this.facets.slice();
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
      showPagination() {
        return this.totalResults > this.perPage;
      }
    },
    watch: watchList,
    methods: {
      paginationLink(val) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ page: val }) } });
      },
      rerouteSearch(queryUpdates) {
        this.isLoading = true;
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
        this.$set(this.selectedFacets, name, selected);
        this.qfForSelectedFacets = [];
        this.reusability = null;
        this.theme = null;
        for (const facetName in this.selectedFacets) {
          const selectedValues = this.selectedFacets[facetName];
          // `reusability` and `theme` have their own API parameter and can not be queried in `qf`
          if (facetName === 'REUSABILITY' && selectedValues.length > 0) {
            this.reusability = selectedValues.join(',');
          } else if (facetName === 'THEME' && this.selectedFacets['THEME']) {
            this.theme = selectedValues;
          } else {
            for (const facetValue of selectedValues) {
              if (this.facetDisplayOrder.includes(facetName)) {
                this.qfForSelectedFacets.push(`${facetName}:"${facetValue}"`);
              } else {
                this.qfForSelectedFacets.push(`${facetName}:${facetValue}`);
              }
            }
          }
        }
        this.rerouteSearch({ qf: this.qfForSelectedFacets, reusability: this.reusability, theme: this.theme, page: '1' });
      },
      selectView(view) {
        if (process.browser) {
          sessionStorage.searchResultsView = view;
          localStorage.searchResultsView = view;
        }
        this.view = view;
      },
      updateCurrentSearchQuery(updates) {
        const current = {
          page: this.page || '1',
          qf: this.qfForSelectedFacets,
          query: this.query || '',
          reusability: this.reusability,
          theme: this.theme,
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
      viewToggleLink(view) {
        return this.localePath({ ...this.route, ...{ query: this.updateCurrentSearchQuery({ view }) } });
      }
    }
  };
</script>
