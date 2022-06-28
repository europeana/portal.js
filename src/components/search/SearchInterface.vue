<template>
  <b-container>
    <div
      class="mb-3 d-flex align-items-start align-items-md-center justify-content-between"
    >
      <SearchResultsContext
        :label-override="editorialEntityLabel"
      />
      <ViewToggles
        v-model="view"
        :link-gen-route="route"
        class="flex-nowrap mt-1 mt-md-0"
      />
    </div>
    <b-row
      class="mb-3"
    >
      <b-col
        cols="12"
      >
        <b-row
          v-if="$fetchState.pending"
          class="flex-md-row py-4 text-center"
        >
          <b-col cols="12">
            <LoadingSpinner />
          </b-col>
        </b-row>
        <template
          v-else
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
                  {{ $t('resultsLimitWarning') }}
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
              />
            </b-col>
          </b-row>
        </template>
      </b-col>
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
      SearchResultsContext: () => import('./SearchResultsContext'),
      InfoMessage,
      ItemPreviewCardGroup,
      LoadingSpinner: () => import('../generic/LoadingSpinner'),
      PaginationNavInput: () => import('../generic/PaginationNavInput'),
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
      showRelated: {
        type: Boolean,
        default: true
      },
      editorialEntityLabel: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        fetched: false
      };
    },
    async fetch() {
      this.viewFromRouteQuery();

      this.$store.dispatch('search/activate');
      this.$store.commit('search/set', ['userParams', this.$route.query]);

      try {
        await this.$store.dispatch('search/run');

        if (this.$store.state.search.error) {
          if (process.server) {
            this.$nuxt.context.res.statusCode = this.$store.state.search.errorStatusCode;
          }
          throw this.$store.state.search.error;
        } else if (this.noResults) {
          throw new Error(this.$t('noResults'));
        }

        this.fetched = true;
      } finally {
        this.$scrollTo && this.$scrollTo('#header');
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
      '$route.query.reusability': '$fetch',
      '$route.query.query': '$fetch',
      '$route.query.qf': '$fetch',
      '$route.query.page': '$fetch'
    },

    destroyed() {
      this.$store.dispatch('search/deactivate');
    },

    methods: {
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
