<template>
  <b-container v-if="$fetchState.pending && !fetched">
    <b-row class="flex-md-row py-4 text-center">
      <b-col cols="12">
        <LoadingSpinner />
      </b-col>
    </b-row>
  </b-container>
  <b-container v-else-if="$fetchState.error">
    <b-row class="flex-md-row">
      <b-col cols="12">
        <AlertMessage
          :error="errorMessage"
        />
      </b-col>
    </b-row>
  </b-container>
  <b-container v-else>
    <b-row
      v-if="hasAnyResults"
      class="mb-3 "
      :class="{ 'd-flex align-items-center': contextLabel }"
    >
      <b-col>
        <div
          v-if="contextLabel || contextLabel === ''"
          class="context-label"
          data-qa="context label"
        >
          {{ contextLabel }}
        </div>
        <template v-else>
          <p
            data-qa="total results"
          >
            {{ $t('results') }}: {{ totalResults | localise }}
          </p>
          <div
            class="visually-hidden"
            role="status"
          >
            {{ $t('searchHasLoaded', [totalResults | localise]) }}
          </div>
        </template>
      </b-col>
      <b-col>
        <ViewToggles
          v-model="view"
          :link-gen-route="route"
        />
      </b-col>
    </b-row>
    <b-row
      class="mb-3"
    >
      <b-col
        cols="12"
      >
        <b-container v-if="$fetchState.pending && fetched">
          <b-row class="flex-md-row py-4 text-center">
            <b-col cols="12">
              <LoadingSpinner />
            </b-col>
          </b-row>
        </b-container>
        <b-row
          v-else
          class="mb-3"
        >
          <b-col>
            <AlertMessage
              v-if="noResults"
              :error="$t('noResults')"
            />
            <p
              v-else-if="noMoreResults"
              data-qa="warning notice"
            >
              {{ $t('noMoreResults') }}
            </p>
            <ItemPreviewCardGroup
              :items="results"
              :hits="hits"
              :view="view"
              :per-row="perRow"
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
              v-if="lastAvailablePage"
            >
              {{ $t('resultsLimitWarning') }}
            </InfoMessage>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <client-only>
              <PaginationNav
                :total-results="totalResults"
                :per-page="perPage"
                :max-results="1000"
              />
            </client-only>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ItemPreviewCardGroup from '../item/ItemPreviewCardGroup'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../generic/InfoMessage';
  import ViewToggles from './ViewToggles';

  import makeToastMixin from '@/mixins/makeToast';

  import { mapState } from 'vuex';

  export default {
    name: 'SearchInterface',

    components: {
      AlertMessage: () => import('../../components/generic/AlertMessage'),
      ClientOnly,
      InfoMessage,
      ItemPreviewCardGroup,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      PaginationNav: () => import('../../components/generic/PaginationNav'),
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
      perRow: {
        type: Number,
        default: 4
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
      contextLabel: {
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

      await this.$store.dispatch('search/run');

      if (this.$store.state.search.error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = this.$store.state.search.errorStatusCode;
        }
        throw this.$store.state.search.error;
      }
      this.fetched = true;
    },
    computed: {
      ...mapState({
        userParams: state => state.search.userParams,
        entityId: state => state.entity.id,
        error: state => state.search.error,
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

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .context-label {
    font-size: $font-size-small;
  }
</style>
