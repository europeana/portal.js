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
      />
    </b-row>
  </b-container>
</template>

<script>
  import ItemPreviewCardGroup from '../item/ItemPreviewCardGroup'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../generic/InfoMessage';
  import ViewToggles from './ViewToggles';

  import makeToastMixin from '@/mixins/makeToast';

  import { mapState } from 'vuex';

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
        default: () => {
          return { name: 'search' };
        }
      },
      showPins: {
        type: Boolean,
        default: false
      },
      editorialOverrides: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        paginationChanged: false
      };
    },

    async fetch() {
      // NOTE: this helps prevent lazy-loading issues when paginating in Chrome 103
      await this.$nextTick();
      this.$scrollTo && await this.$scrollTo('#header', { cancelable: false });
      this.viewFromRouteQuery();

      this.$store.dispatch('search/activate');
      this.$store.commit('search/set', ['userParams', this.$route.query]);

      await this.$store.dispatch('search/run');

      if (this.$store.state.search.error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = this.$store.state.search.errorStatusCode;
        }
        throw this.$store.state.search.error;
      } else if (this.noResults) {
        throw new Error(this.$t('noResults'));
      }
    },

    computed: {
      ...mapState({
        userParams: state => state.search.userParams,
        hits: state => state.search.hits,
        lastAvailablePage: state => state.search.lastAvailablePage,
        results: state => state.search.results,
        totalResults: state => state.search.totalResults
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
        return this.debugSettings?.boosting;
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
      routeQueryView: 'viewFromRouteQuery',
      '$route.query.api': '$fetch',
      '$route.query.boost': '$fetch',
      '$route.query.reusability': '$fetch',
      '$route.query.query': '$fetch',
      '$route.query.qf': 'watchRouteQueryQf',
      '$route.query.page': 'handlePaginationChanged'
    },

    destroyed() {
      this.$store.dispatch('search/deactivate');
    },

    methods: {
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

      viewFromRouteQuery() {
        if (this.routeQueryView) {
          this.view = this.routeQueryView;
          this.$cookies && this.$cookies.set('searchResultsView', this.routeQueryView);
          this.$store.commit('search/set', ['userParams', this.$route.query]);
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
