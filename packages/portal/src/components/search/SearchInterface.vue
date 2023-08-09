<template>
  <b-container
    data-qa="search interface"
    class="white-page pt-5 page-container side-filters-enabled"
  >
    <b-row
      class="flex-row flex-nowrap"
    >
      <b-col
        class="col-results"
      >
        <b-container
          class="px-0 pb-3"
        >
          <client-only>
            <SearchBoostingForm
              v-if="showSearchBoostingForm"
              class="mb-3"
            />
          </client-only>
          <client-only>
            <transition
              name="fade"
            >
              <SearchQueryBuilder
                v-show="showAdvancedSearch"
                id="search-query-builder"
                class="d-none mb-3"
                :class="{'d-lg-block': showAdvancedSearch}"
                @show="(show) => showAdvancedSearch = show"
              />
            </transition>
          </client-only>
          <section>
            <div
              class="mb-3 d-flex align-items-start justify-content-between"
            >
              <!-- This div prevents SearchViewToggles jumping around as SearchResultsContext is shown & hidden -->
              <div v-show="$fetchState.pending" />
              <SearchResultsContext
                v-show="!$fetchState.pending"
                :total-results="totalResults"
                :entity="$store.state.entity.entity"
                :query="query"
                badge-variant="primary-light"
              />
              <SearchViewToggles
                v-model="view"
              />
            </div>
            <b-row
              class="mb-3"
            >
              <b-col
                cols="12"
              >
                <b-row
                  v-show="$fetchState.pending"
                  class="flex-md-row py-4 text-center"
                >
                  <b-col cols="12">
                    <LoadingSpinner
                      :status-message="$t('loadingResults')"
                    />
                  </b-col>
                </b-row>
                <template
                  v-if="!$fetchState.pending"
                >
                  <b-row
                    class="mb-3"
                  >
                    <b-col>
                      <ErrorMessage
                        v-if="$fetchState.error"
                        :error="$fetchState.error"
                        :gridless="false"
                        :full-height="false"
                        :show-message="showErrorMessage"
                      />
                      <template
                        v-else
                      >
                        <p
                          v-show="noMoreResults"
                          data-qa="warning notice"
                        >
                          {{ $t('noMoreResults') }}
                        </p>
                        <ItemPreviewCardGroup
                          id="item-search-results"
                          :items="results"
                          :hits="hits"
                          :view="view"
                          :show-pins="showPins"
                          :on-click-card="onClickItem"
                          @drawn="handleResultsDrawn"
                        >
                          <slot />
                          <template
                            v-if="page === 1"
                            #related-galleries
                          >
                            <slot
                              name="related-galleries"
                            />
                          </template>
                          <template
                            v-if="page === 1"
                            #related-collections
                          >
                            <slot
                              name="related-collections"
                            />
                          </template>
                        </ItemPreviewCardGroup>
                        <InfoMessage
                          v-show="lastAvailablePage"
                        >
                          {{ $t('search.results.limitWarning') }}
                        </InfoMessage>
                      </template>
                    </b-col>
                  </b-row>
                  <b-row
                    v-show="!$fetchState.error"
                  >
                    <b-col>
                      <PaginationNavInput
                        :total-results="totalResults"
                        :per-page="perPage"
                        :max-results="1000"
                        aria-controls="item-search-results"
                        data-qa="search results pagination"
                      />
                    </b-col>
                  </b-row>
                </template>
              </b-col>
            </b-row>
          </section>
        </b-container>
        <slot
          v-if="page === 1"
          name="after-results"
        />
      </b-col>
      <SearchFilters
        :route="route"
        :collection="collection"
        :api-params="apiParams"
        :api-options="apiOptions"
        :user-params="userParams"
      >
        <b-row
          class="d-flex justify-content-between align-items-center flex-nowrap"
        >
          <span
            class="d-flex"
          >
            <b-button
              aria-controls="search-query-builder search-query-builder-mobile"
              :aria-expanded="showAdvancedSearch"
              class="search-toggle query-builder-toggle ml-3 my-3 flex-grow-1"
              :class="{ 'open': showAdvancedSearch }"
              data-qa="toggle advanced search button"
              variant="link"
              @click="toggleAdvancedSearch"
            >
              {{ $t('search.advanced.show', { 'showOrHide': showAdvancedSearch ? $t('actions.hide') : $t('actions.show') }) }} {{ advancedSearchQueryCount ? `(${advancedSearchQueryCount})` : '' }}
            </b-button>
            <b-button
              v-b-tooltip.bottom
              :title="$t('search.advanced.tooltip.advancedSearch')"
              class="icon-info-outline p-0 tooltip-button ml-1 mr-3"
              variant="light-flat"
            />
          </span>
          <b-button
            data-qa="close filters button"
            class="button-icon-only icon-clear mx-3"
            variant="light-flat"
            :aria-label="$t('header.closeSidebar')"
            @click="toggleFilterSheet"
          />
        </b-row>
        <transition
          name="fade"
        >
          <SearchQueryBuilder
            v-show="showAdvancedSearch"
            id="search-query-builder-mobile"
            class="d-lg-none"
            @show="(show) => showAdvancedSearch = show"
          />
        </transition>
      </SearchFilters>
    </b-row>
  </b-container>
</template>

<script>
  import merge from 'deepmerge';

  import ItemPreviewCardGroup from '../item/ItemPreviewCardGroup'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../generic/InfoMessage';
  import SearchFilters from './SearchFilters';
  import SearchViewToggles from './SearchViewToggles';

  import makeToastMixin from '@/mixins/makeToast';
  import { filtersFromQf } from '@/plugins/europeana/search';

  export default {
    name: 'SearchInterface',

    components: {
      ErrorMessage: () => import('../error/ErrorMessage'),
      SearchBoostingForm: () => import('./SearchBoostingForm'),
      SearchQueryBuilder: () => import('./SearchQueryBuilder'),
      SearchResultsContext: () => import('./SearchResultsContext'),
      InfoMessage,
      ItemPreviewCardGroup,
      LoadingSpinner: () => import('../generic/LoadingSpinner'),
      PaginationNavInput: () => import('../generic/PaginationNavInput'),
      SearchFilters,
      SearchViewToggles
    },

    mixins: [
      makeToastMixin
    ],

    props: {
      perPage: {
        type: Number,
        default: 24
      },
      route: {
        type: Object,
        default: () => ({ name: 'search' })
      },
      showPins: {
        type: Boolean,
        default: false
      },
      overrideParams: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        hits: null,
        lastAvailablePage: null,
        page: null,
        results: [],
        totalResults: null,
        paginationChanged: false,
        showAdvancedSearch: false
      };
    },

    async fetch() {
      // NOTE: this helps prevent lazy-loading issues when paginating in Chrome 103
      await this.$nextTick();
      this.$scrollTo && await this.$scrollTo('#header', { cancelable: false });
      this.setViewFromRouteQuery();


      // FIXME: same storage issue applies to qf, query, etc...
      // Don't use a computed property for page, as it need to be kept for `onClickItem`
      // This causes double jumps on pagination when using the > arrow, for some reason
      // this.page = this.userParams.page;
      // This is a workaround
      this.page = Number(this.$route.query.page || 1);

      this.$store.commit('search/setActive', true);

      try {
        await this.runLoggedSearch();
      } catch (error) {
        const paginationError = error.message.match(/It is not possible to paginate beyond the first (\d+)/);
        if (paginationError) {
          error.code = 'searchPaginationLimitExceeded';
          error.message = 'Pagination limit exceeded';
          this.$error(error, {
            tValues: { description: { limit: this.$options.filters.localise(Number(paginationError[1])) } }
          });
        } else {
          this.$error(error);
        }
      }

      if (this.noResults) {
        const error = new Error('No search results');
        error.code = 'searchResultsNotFound';
        this.$error(error);
      }
    },

    computed: {
      advancedSearchQueryCount() {
        return this.qa.length;
      },
      userParams() {
        return this.$route.query;
      },
      apiOptions() {
        const apiOptions = {};

        if (this.hasFulltextQa) {
          // TODO: ensure this is aware of per-request fulltext url, e.g. from ingress headers
          apiOptions.url = this.$config.europeana.apis.fulltext.url;
        }

        return apiOptions;
      },
      // TODO: reduce cognitive complexity
      apiParams() {
        const params = ['boost', 'qf', 'query', 'reusability', 'sort'].reduce((memo, field) => {
          if (this[field] && (!Array.isArray(this[field]) || this[field].length > 0)) {
            memo[field] = this[field];
          }
          return memo;
        }, {});

        params.page = this.page;
        params.profile = 'minimal';
        params.rows = this.perPage;

        if (this.advancedSearchQueryCount > 0) {
          if (this.hasFulltextQa) {
            // If there are any advanced search full-text rules, then
            // these are promoted to the primary query, and any other query
            // (from the simple search bar) is demoted to a qf, fielded to
            // `text` if not already fielded.
            if (params.query && !params.query.includes(':')) {
              params.query = `text:(${params.query})`;
            }
            params.qf = (params.qf || []).concat(params.query || []);
            params.query = this.fulltextQas.join(' AND ');
            params.profile = `${params.profile},hits`;
          }

          // All other advanced search rules go into qf's.
          params.qf = (params.qf || [])
            .concat(this.qa.filter((qa) => !this.fulltextQas.includes(qa)));
        }

        return merge(params, this.overrideParams);
      },
      boost() {
        return this.userParams.boost;
      },
      qa() {
        return [].concat(this.userParams.qa || []);
      },
      qf() {
        return [].concat(this.userParams.qf || []);
      },
      query() {
        return this.userParams.query;
      },
      reusability() {
        return this.userParams.reusability;
      },
      sort() {
        return this.userParams.sort;
      },
      hasAnyResults() {
        return this.totalResults > 0;
      },
      noMoreResults() {
        return this.hasAnyResults && this.results.length === 0;
      },
      noResults() {
        return this.totalResults === 0 || !this.totalResults;
      },
      debugSettings() {
        return this.$store.getters['debug/settings'];
      },
      showErrorMessage() {
        return !this.$fetchState.error?.code ||
          !['searchResultsNotFound', 'searchPaginationLimitExceeded'].includes(this.$fetchState.error?.code);
      },
      showSearchBoostingForm() {
        return !!this.debugSettings?.boosting;
      },
      routeQueryView() {
        return this.$route.query.view;
      },
      view: {
        get() {
          return this.$store.getters['search/activeView'];
        },
        set(value) {
          this.$store.commit('search/setView', value);
        }
      },
      collection() {
        return filtersFromQf(this.apiParams.qf).collection?.[0];
      },
      fulltextQas() {
        return this.qa
          .filter((rule) => rule.startsWith('fulltext:') || rule.startsWith('NOT fulltext:'));
      },
      hasFulltextQa() {
        return this.fulltextQas.length > 0;
      }
    },

    watch: {
      routeQueryView: 'setViewFromRouteQuery',
      '$route.query.boost': '$fetch',
      '$route.query.reusability': '$fetch',
      '$route.query.qa': '$fetch',
      '$route.query.query': '$fetch',
      '$route.query.qf': 'watchRouteQueryQf',
      '$route.query.page': 'handlePaginationChanged'
    },

    destroyed() {
      this.$store.commit('search/setActive', false);
    },

    methods: {
      onClickItem(identifier) {
        const transaction = this.$apm?.startTransaction('Search - result clicked', 'user-interaction');
        console.log('page', this.page)
        console.log('per page', this.perPage)
        const rank = this.results.findIndex(item => item.id === identifier) + 1 + ((this.page - 1) * this.perPage);
        console.log('rank', rank)
        transaction?.addLabels({
          'search_params_qf': this.apiParams.qf || null,
          'search_params_query': this.apiParams.query || null,
          'search_params_reusability': this.apiParams.reusability || null,
          'search_rank': rank
        });
        transaction?.end();
      },

      async runSearch() {
        const response = await this.$apis.record.search(this.apiParams, { ...this.apiOptions, locale: this.$i18n.locale });

        this.hits = response.hits;
        this.lastAvailablePage = response.lastAvailablePage;
        this.results = response.items;
        this.totalResults = response.totalResults;
      },

      async runLoggedSearch() {
        const transaction = this.$apm?.startTransaction('Search - results fetched', 'user-interaction');
        transaction?.addLabels({
          'search_params_qf': this.apiParams.qf || null,
          'search_params_query': this.apiParams.query || null,
          'search_params_reusability': this.apiParams.reusability || null
        });

        await this.runSearch();

        transaction?.addLabels({
          'search_results_total': this.totalResults
        });
        transaction?.end();
      },

      handlePaginationChanged() {
        this.paginationChanged = true;
        this.$fetch();
      },

      handleResultsDrawn(cardRefs) {
        if (this.paginationChanged) {
          // Move the focus to the first item
          const cardLink = cardRefs?.[0]?.$el?.getElementsByTagName('a')?.[0];
          cardLink?.focus();
          this.paginationChanged = false;
        }
      },

      watchRouteQueryQf(newVal, oldVal) {
        // Coerce into arrays, handling undefined
        const newVals = newVal ? [].concat(newVal) : [];
        const oldVals = oldVal ? [].concat(oldVal) : [];

        // Test that the values in the two arrays have in fact changed in their
        // contents, as the watch gets triggered by other changes to the route
        // which result in new array objects being constructed for qf, but having
        // the same contents.
        const addedVals = newVals.filter((val) => !oldVals.includes(val));
        const removedVals = oldVals.filter((val) => !newVals.includes(val));
        if (addedVals.length === 0 && removedVals.length === 0) {
          return;
        }

        this.$fetch();
      },

      setViewFromRouteQuery() {
        if (this.routeQueryView) {
          this.view = this.routeQueryView;
          this.$cookies?.set('searchResultsView', this.routeQueryView);
        }
      },

      toggleAdvancedSearch() {
        this.showAdvancedSearch = !this.showAdvancedSearch;
      },

      toggleFilterSheet() {
        this.$store.commit('search/setShowFiltersSheet', !this.$store.state.search.showFiltersSheet);
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/transitions';

.col-results {
  min-width: 0;

  @media (min-width: $bp-xxxl) {
    padding-right: 4rem;
    padding-left: 4rem;
  }
}

.mb-3 {
  @media (min-width: $bp-4k) {
    margin-bottom: 1.5rem !important;
  }
}

::v-deep .container {
  @media (min-width: $bp-xxl) {
    max-width: calc(7 * $max-card-width);
  }
}

::v-deep .search-toggle {
  text-transform: uppercase;
  font-weight: 600;
  font-size: $font-size-small;
  padding: 0;

  @media (min-width: $bp-4k) {
    font-size: $font-size-small-4k;
  }

  &:hover,
  &:focus {
    text-decoration: none;
  }

  &::before {
    content: '+';
  }

  &.open::before {
    content: '-';
  }
}

.query-builder-toggle {
  @media (min-width: $bp-large) {
    &::before {
      content: '<';
    }

    &.open::before {
      content: '>';
    }
  }
}
</style>
