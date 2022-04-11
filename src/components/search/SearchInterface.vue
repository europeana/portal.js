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
    <template
      v-if="contentfulResults && contentfulResults.length > 0"
    >
      <h2 class="related-heading text-uppercase mt-4 mb-2">
        Editorial content you may like
      </h2>
      <b-card-group
        class="card-deck-4-cols"
        deck
      >
        <ContentCard
          v-for="result in contentfulResults"
          :key="result.identifier"
          :title="result.name"
          :url="result.url"
          :description="result.description"
          :image-url="result.imageUrl"
          :image-content-type="result.imageContentType"
          :image-optimisation-options="{ width: 510 }"
          variant="mini"
        />
      </b-card-group>
    </template>
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
  import ContentCard from '../generic/ContentCard';

  import makeToastMixin from '@/mixins/makeToast';

  import flatten from 'lodash/flatten';
  import { mapState } from 'vuex';

  export default {
    name: 'SearchInterface',

    components: {
      AlertMessage: () => import('../generic/AlertMessage'),
      ContentCard,
      ClientOnly,
      SearchResultsContext: () => import('./SearchResultsContext'),
      InfoMessage,
      ItemPreviewCardGroup,
      LoadingSpinner: () => import('../generic/LoadingSpinner'),
      PaginationNav: () => import('../generic/PaginationNav'),
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
      editorialEntityLabel: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        contentfulResults: null,
        fetched: false
      };
    },
    async fetch() {
      this.viewFromRouteQuery();

      // Contentful content search
      const variables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        query: this.$route.query.query
      };

      this.$contentful.query('contentSearch', variables)
        .then(response => {
          const results = flatten(Object.values(response.data.data).map(collection => collection.items)).slice(0, 4);
          for (const result of results) {
            let prefix = '/';
            let image = result.primaryImageOfPage?.image;

            switch (result['__typename']) {
            case 'BlogPosting':
              prefix = '/blog/';
              break;
            case 'ExhibitionPage':
              prefix = '/exhibitions/';
              break;
            case 'StaticPage':
              break;
            case 'BrowsePage':
              image = image?.image || result?.image;
              break;
            }

            result.url = `${prefix}${result.identifier}`;
            result.imageUrl = image?.url;
            result.imageContentType = image?.contentType;
          }
          this.contentfulResults = results;
        });

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
