<template>
  <b-container
    data-qa="search interface"
    class="page-container side-filters-enabled"
    :class="{
      'white-page': noResultsFound,
      'pt-5': noResultsFound
    }"
  >
    <!-- TODO: Clean up when API issues are resolved -->
    <NotificationBanner
      v-if="$features.setsBroken"
      :notification-text="$t('notification.api')"
      class="mb-3"
    />
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
                :editorial-overrides="editorialOverrides"
                :badge-variant="noResultsFound ? 'primary-light' : 'light'"
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
                        :title-path="$fetchState.error.titlePath"
                        :description-path="$fetchState.error.descriptionPath"
                        :illustration-src="$fetchState.error.illustrationSrc"
                        :gridless="false"
                        :full-height="false"
                        :error="!noResultsFound ? errorMessage : null"
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
                            #related
                          >
                            <slot
                              name="related"
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
          name="after-results"
        />
      </b-col>
      <SideFilters
        :route="route"
        :collection="collection"
        :api-params="apiParams"
        :api-options="apiOptions"
        :user-params="userParams"
      />
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

  const NO_RESULTS_FOUND = 'no results found';

  export default {
    name: 'SearchInterface',

    components: {
      ErrorMessage: () => import('../generic/ErrorMessage'),
      SearchBoostingForm: () => import('./SearchBoostingForm'),
      SearchResultsContext: () => import('./SearchResultsContext'),
      InfoMessage,
      ItemPreviewCardGroup,
      LoadingSpinner: () => import('../generic/LoadingSpinner'),
      PaginationNavInput: () => import('../generic/PaginationNavInput'),
      SideFilters: () => import('./SideFilters'),
      ViewToggles,
      NotificationBanner: () => import('@/components/generic/NotificationBanner')
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
      editorialOverrides: {
        type: Object,
        default: null
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
        paginationChanged: false
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
        if (process.server) {
          this.$nuxt.context.res.statusCode = error.statusCode || 500;
        }
        throw error;
      }

      if (this.noResults) {
        const error = new Error();
        error.titlePath = 'errorMessage.searchResultsNotFound.title';
        error.descriptionPath = 'errorMessage.searchResultsNotFound.description';
        error.illustrationSrc = require('@/assets/img/illustrations/il-search-results-not-found.svg');
        error.message = NO_RESULTS_FOUND;
        throw error;
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
      errorMessage() {
        if (!this.$fetchState.error?.message) {
          return null;
        }

        const paginationError = this.$fetchState.error.message.match(/It is not possible to paginate beyond the first (\d+)/);
        if (paginationError !== null) {
          const localisedPaginationLimit = this.$options.filters.localise(Number(paginationError[1]));
          return this.$t('messages.paginationLimitExceeded', { limit: localisedPaginationLimit });
        }

        return this.$fetchState.error.message;
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
      noResultsFound() {
        return this.$fetchState?.error?.message === NO_RESULTS_FOUND;
      },
      debugSettings() {
        return this.$store.getters['debug/settings'];
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
        this.theme = themes.find(theme => theme.qf === this.collection);

        const apiOptions = {};

        if (this.theme?.filters?.api) {
          // Set default API (of fulltext or metadata), from theme config
          if (!apiParams.api) {
            apiParams.api = this.theme.filters.api.default;
          }
          if (apiParams.api === 'fulltext') {
            apiParams.profile = 'minimal,hits';
            apiOptions.url = this.$config.europeana.apis.record.fulltextUrl;
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  .col-results {
    min-width: 0;
  }
</style>
