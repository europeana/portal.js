<template>
  <b-container
    data-qa="search interface"
    class="page-container side-filters-enabled"
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
              />
              <ViewToggles
                v-model="view"
                :link-gen-route="route"
                class="flex-nowrap mt-md-2"
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
                      <AlertMessage
                        v-show="$fetchState.error"
                        :error="errorMessage"
                      />
                      <template
                        v-if="!$fetchState.error"
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
                          :show-related="showRelated"
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

  import { BASE_URL as FULLTEXT_BASE_URL } from '@/plugins/europeana/newspaper';
  import makeToastMixin from '@/mixins/makeToast';
  import themes from '@/plugins/europeana/themes';
  import { filtersFromQf } from '@/plugins/europeana/search';

  import merge from 'deepmerge';

  export default {
    name: 'SearchInterface',

    components: {
      AlertMessage: () => import('../generic/AlertMessage'),
      SearchBoostingForm: () => import('./SearchBoostingForm'),
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
      showRelated: {
        type: Boolean,
        default: true
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
        totalResults: null
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
        throw new Error(this.$t('noResults'));
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
        return this.totalResults === 0;
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
      '$route.query.qf': '$fetch',
      '$route.query.page': '$fetch'
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
            apiParams.api = this.theme.filters.api.default
          }
          if (apiParams.api === 'fulltext') {
            apiParams.profile = 'minimal,hits';
            apiOptions.url = FULLTEXT_BASE_URL;
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
