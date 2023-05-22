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
                v-if="advancedSearchEnabled"
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
              <!-- This div prevents ViewToggles jumping around as SearchResultsContext is shown & hidden -->
              <div v-show="$fetchState.pending" />
              <SearchResultsContext
                v-show="!$fetchState.pending"
                :total-results="totalResults"
                :entity="$store.state.entity.entity"
                :query="query"
                badge-variant="primary-light"
              />
              <ViewToggles
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
      <SideFilters
        :route="route"
        :collection="collection"
        :api-params="apiParams"
        :api-options="apiOptions"
        :user-params="userParams"
      >
        <b-row
          v-if="advancedSearchEnabled"
        >
          <b-button
            aria-controls="search-query-builder search-query-builder-mobile"
            :aria-expanded="showAdvancedSearch"
            class="search-toggle query-builder-toggle m-3"
            :class="{ 'open': showAdvancedSearch }"
            variant="link"
            @click="toggleAdvancedSearch"
          >
            {{ $t('search.advanced.show', { 'show': showAdvancedSearch ? 'hide' : 'show' }) }}
          </b-button>
        </b-row>
        <transition
          name="fade"
        >
          <SearchQueryBuilder
            v-show="showAdvancedSearch"
            v-if="advancedSearchEnabled"
            id="search-query-builder-mobile"
            class="d-lg-none"
            @show="(show) => showAdvancedSearch = show"
          />
        </transition>
      </SideFilters>
    </b-row>
  </b-container>
</template>

<script>
  import ItemPreviewCardGroup from '../item/ItemPreviewCardGroup'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../generic/InfoMessage';
  import ViewToggles from './ViewToggles';

  import makeToastMixin from '@/mixins/makeToast';
  import themes from '@/plugins/europeana/themes';
  import { filtersFromQf } from '@/plugins/europeana/search';

  import merge from 'deepmerge';

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
      SideFilters: () => import('./SideFilters'),
      ViewToggles
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
        apiOptions: {},
        apiParams: {},
        collection: null,
        hits: null,
        lastAvailablePage: null,
        results: [],
        theme: null,
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

      this.$store.commit('search/setActive', true);

      try {
        await this.runSearch();
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
      userParams() {
        return this.$route.query;
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
      advancedSearchEnabled() {
        return this.$features.advancedSearch;
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
      }
    },

    watch: {
      routeQueryView: 'setViewFromRouteQuery',
      '$route.query.api': '$fetch',
      '$route.query.boost': '$fetch',
      '$route.query.reusability': '$fetch',
      '$route.query.query': '$fetch',
      '$route.query.qf': 'watchRouteQueryQf',
      '$route.query.page': 'handlePaginationChanged'
    },

    destroyed() {
      this.$store.commit('search/setActive', false);
    },

    methods: {
      // TODO: could this be refactored into two computed properties, for
      //       apiOptions, and apiParams?
      deriveApiSettings() {
        const userParams = { ...this.userParams };
        // Coerce qf from user input into an array as it may be a single string
        userParams.qf = [].concat(userParams.qf || []);

        const apiParams = merge(userParams, this.overrideParams);

        if (!apiParams.profile) {
          apiParams.profile = 'minimal';
        }

        const collectionFilter = filtersFromQf(apiParams.qf).collection;
        this.collection = collectionFilter ? collectionFilter[0] : null;
        this.theme = themes.find((theme) => theme.qf === this.collection);

        const apiOptions = {};

        if (this.theme?.filters?.api) {
          // Set default API (of fulltext or metadata), from theme config
          if (!apiParams.api) {
            apiParams.api = this.theme.filters.api.default;
          }
          if (apiParams.api === 'fulltext') {
            apiParams.profile = 'minimal,hits';
            apiOptions.url = this.$config.europeana.apis.fulltext.url;
          }
        }

        this.apiOptions = apiOptions;
        this.apiParams = apiParams;
      },

      async runSearch() {
        this.deriveApiSettings();

        const response = await this.$apis.record.search(this.apiParams, { ...this.apiOptions, locale: this.$i18n.locale });

        this.hits = response.hits;
        this.lastAvailablePage = response.lastAvailablePage;
        this.results = response.items;
        this.totalResults = response.totalResults;
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
          this.$cookies && this.$cookies.set('searchResultsView', this.routeQueryView);
        }
      },

      toggleAdvancedSearch() {
        this.showAdvancedSearch = !this.showAdvancedSearch;
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
