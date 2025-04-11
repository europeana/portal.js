<template>
  <b-container
    data-qa="search interface"
    class="search-page-container side-filters-enabled"
    :class="{ 'search-bar-open': showSearchBar }"
  >
    <b-row
      class="flex-row flex-nowrap"
    >
      <b-col
        class="col-results"
      >
        <client-only>
          <transition
            name="fade"
          >
            <SearchQueryBuilder
              v-show="showAdvancedSearch"
              id="search-query-builder"
              ref="queryBuilder"
              tabindex="0"
              class="d-none mb-3"
              :class="{'d-lg-block': showAdvancedSearch}"
              @show="(show) => showAdvancedSearch = show"
            />
          </transition>
        </client-only>
        <ErrorMessage
          v-if="$fetchState.error"
          :error="$fetchState.error"
          :full-height="false"
          :show-message="showErrorMessage"
          title-tag="h2"
        />
        <b-row v-else>
          <ItemPreviewInterface
            data-qa="liked items"
            :items="results"
            :hits="hits"
            :loading="$fetchState.pending"
            :max-results="1000"
            :per-page="perPage"
            :show-pins="showPins"
            :total="totalResults"
            :on-aux-click-card="onClickItem"
            :on-click-card="onClickItem"
            class="w-100 mb-3"
            @drawn="handleResultsDrawn"
          >
            <template #heading>
              <SearchResultsContext
                :total-results="totalResults"
                :entity="$store.state.entity.entity"
                :query="query"
                badge-variant="primary-light"
                class="mr-auto"
              />
            </template>
            <template #search-options>
              <SearchMultilingualButton
                v-if="showMultilingualButton"
                :multilingual-state="multilingualSearch"
                @toggleMultilingual="(value) => multilingualSearch = value"
              />
            </template>
            <template
              #no-more-items
            >
              <p data-qa="warning notice">
                {{ $t('noMoreResults') }}
              </p>
            </template>
            <template
              #no-items
            >
              <ErrorMessage
                :error="{ code: 'searchResultsNotFound', i18n: $t('errorMessage.searchResultsNotFound') }"
                :full-height="false"
                :show-message="false"
                title-tag="h2"
              />
            </template>
            <template #card-group-header>
              <slot name="card-group-header" />
            </template>
            <template
              v-if="page === 1"
              #card-group-related-galleries
            >
              <slot
                name="card-group-related-galleries"
              />
            </template>
            <template
              v-if="page === 1"
              #card-group-related-collections
            >
              <slot
                name="card-group-related-collections"
              />
            </template>
            <template
              v-if="lastAvailablePage"
              #footer
            >
              <InfoMessage>
                {{ $t('search.results.limitWarning') }}
              </InfoMessage>
            </template>
          </ItemPreviewInterface>
        </b-row>
        <slot
          v-if="page === 1"
          name="after-results"
        />
      </b-col>
      <SearchSidebar
        :advanced-search-query-count="advancedSearchQueryCount"
        :show-advanced-search="showAdvancedSearch"
        @showAdvancedSearch="(val) => showAdvancedSearch = val"
        @focusQueryBuilder="$refs.queryBuilder?.$el.focus();"
      >
        <SearchFilters
          :route="route"
          :collection="collection"
          :api-params="apiParams"
          :api-options="apiOptions"
          :user-params="userParams"
        />
      </SearchSidebar>
    </b-row>
  </b-container>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import merge from 'deepmerge';
  import isEqual from 'lodash/isEqual.js';
  import isUndefined from 'lodash/isUndefined.js';
  import omitBy from 'lodash/omitBy.js';
  import uniq from 'lodash/uniq.js';

  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface'; // Sorted before InfoMessage to prevent Conflicting CSS sorting warning
  import InfoMessage from '../generic/InfoMessage';
  import SearchFilters from './SearchFilters';
  import SearchSidebar from './SearchSidebar';

  import elasticApmReporterMixin from '@/mixins/elasticApmReporter';
  import { addContentTierFilter, filtersFromQf } from '@/plugins/europeana/search';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';
  import useScrollTo from '@/composables/scrollTo.js';
  import SearchMultilingualButton from './SearchMultilingualButton.vue';

  export default {
    name: 'SearchInterface',

    components: {
      ClientOnly,
      ErrorMessage: () => import('../error/ErrorMessage'),
      SearchQueryBuilder: () => import('./SearchQueryBuilder'),
      SearchResultsContext: () => import('./SearchResultsContext'),
      InfoMessage,
      ItemPreviewInterface,
      SearchFilters,
      SearchMultilingualButton,
      SearchSidebar
    },

    mixins: [
      advancedSearchMixin,
      elasticApmReporterMixin
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
      defaultParams: {
        type: Object,
        default: () => ({})
      }
    },

    setup() {
      const { scrollToSelector } = useScrollTo();
      return { scrollToSelector };
    },

    data() {
      return {
        apiParams: {},
        hits: null,
        lastAvailablePage: null,
        multilingualSearch: false,
        paginationChanged: false,
        results: [],
        showAdvancedSearch: false,
        totalResults: null,
        qasWithAddedEntityValue: []
      };
    },

    async fetch() {
      this.$store.commit('search/setActive', true);
      this.multilingualSearch = Boolean(this.$auth.loggedIn && this.multilingualSearchEnabledForLocale && this.$cookies.get('multilingualSearch'));

      // NOTE: this helps prevent lazy-loading issues when paginating in Chrome 103
      await this.$nextTick();
      process.client && this.scrollToSelector('#header');

      // Remove cleared rules
      const qaRules = this.advancedSearchRulesFromRouteQuery();
      this.qasWithAddedEntityValue = this.qasWithAddedEntityValue.filter(qaWithEntity => {
        return qaRules.find(qa => isEqual(qa, qaWithEntity.qa));
      });

      const qasToLookUp = this.advancedSearchQueriesForEntityLookUp();

      if (qasToLookUp.length) {
        await this.addEntityValuesToAdvancedSearchFields(qasToLookUp);
      }

      this.deriveApiParams();

      try {
        await this.runSearch();
      } catch (error) {
        const paginationError = error.message.match(/It is not possible to paginate beyond the first (\d+)/);
        if (paginationError) {
          error.code = 'searchPaginationLimitExceeded';
          error.message = 'Pagination limit exceeded';
          this.$error(error, {
            tValues: { description: { limit: this.$i18n.n(Number(paginationError[1])) } }
          });
        } else {
          this.$error(error);
        }
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
          apiOptions.url = this.$apis.fulltext.baseURL;
        }

        if (this.translateLang) {
          apiOptions.translateLang = this.translateLang;
        }

        return apiOptions;
      },
      boost() {
        return this.userParams.boost;
      },
      qa() {
        return [].concat(this.userParams.qa || []);
      },
      qaes() {
        return this.qasWithAddedEntityValue
          .map((qaWithEntity) => qaWithEntity.qae)
          .filter((qae) => !!qae);
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
      page() {
        // This causes double jumps on pagination when using the > arrow, for some reason
        // return this.userParams.page;

        // This is a workaround
        return Number(this.$route.query.page || 1);
      },
      noResults() {
        return this.totalResults === 0 || !this.totalResults;
      },
      showErrorMessage() {
        return !this.$fetchState.error?.code ||
          !['searchResultsNotFound', 'searchPaginationLimitExceeded'].includes(this.$fetchState.error?.code);
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
      },
      // Allow translation depending on toggle state. Pre multilingualToggle feature allow for logged in users only.
      allowTranslate() {
        if (this.$features?.multilingualSearch) {
          return this.multilingualSearch;
        }
        return this.$auth.loggedIn;
      },
      translateLang() {
        if (!this.allowTranslate) {
          return null;
        }

        // Either translate locale(s) not configured, or current locale is not
        // among them.
        if (!this.multilingualSearchEnabledForLocale) {
          return null;
        }

        return this.$i18n.locale;
      },
      qasWithSelectedEntityValue() {
        return this.$store.state.search.qasWithSelectedEntityValue;
      },
      showSearchBar() {
        return this.$store.state.search.showSearchBar;
      },
      multilingualSearchEnabledForLocale() {
        return this.$config?.app?.search?.translateLocales?.includes(this.$i18n.locale);
      },
      showMultilingualButton() {
        return Boolean(this.$features.multilingualSearch && this.multilingualSearchEnabledForLocale);
      }
    },

    watch: {
      // TODO: is boost still used?
      '$route.query.boost': 'handleSearchParamsChanged',
      '$route.query.reusability': 'handleSearchParamsChanged',
      '$route.query.qa': 'handleSearchParamsChanged',
      '$route.query.query': 'handleSearchParamsChanged',
      '$route.query.qf': 'watchRouteQueryQf',
      '$route.query.page': 'handlePaginationChanged',
      multilingualSearch() {
        this.$fetch();
      }
    },

    mounted() {
      if (this.query) {
        this.$store.commit('search/setShowSearchBar', true);
      }
    },

    destroyed() {
      this.$store.commit('search/setActive', false);
    },

    methods: {
      // NOTE: deliberately not computed, so that `apiParams` can be used by
      //       `onClickItem`
      // TODO: reduce cognitive complexity
      deriveApiParams() {
        const localParams = omitBy({
          boost: this.boost,
          qf: this.qf,
          query: this.query,
          reusability: this.reusability,
          sort: this.sort,
          page: this.page,
          profile: 'minimal',
          rows: this.perPage
        }, isUndefined);

        const params = merge(this.defaultParams, localParams);

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
            .concat(this.qa.filter((qa) => !this.fulltextQas.includes(qa))).concat(this.qaes);
        }

        params.qf = addContentTierFilter(params.qf);
        params.qf = uniq(params.qf);

        this.apiParams = params;
      },

      // NOTE: do not use computed properties here as they may change when the
      //       item is clicked
      onClickItem(identifier) {
        const rank = this.results.findIndex(item => item.id === identifier) + 1 +
          ((this.apiParams.page - 1) * this.apiParams.rows);
        this.recordSearchInteraction('click result', { 'search_result_rank': rank });
      },

      recordSearchInteraction(name, labels = {}) {
        for (const param of ['qf', 'query', 'reusability']) {
          if (this.apiParams[param]) {
            labels[`search_params_${param}`] = this.apiParams[param];
          }
        }
        labels['search_results_total'] = this.totalResults;

        this.logApmTransaction({
          name: `Search - ${name}`,
          labels
        });
      },

      async runSearch() {
        const response = await this.$apis.record.search(this.apiParams, this.apiOptions);

        this.hits = response.hits;
        this.lastAvailablePage = response.lastAvailablePage;
        this.results = response.items;
        this.totalResults = response.totalResults;

        if (process.server || this.$store.state.search.loggableInteraction) {
          this.recordSearchInteraction('fetch results');
          this.$store.commit('search/setLoggableInteraction', false);
        }
      },

      handleSearchParamsChanged() {
        this.$store.commit('set/setSelected', []);
        this.itemMultiSelect = false;
        this.$fetch();
      },

      handlePaginationChanged() {
        this.paginationChanged = true;
        this.handleSearchParamsChanged();
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

        this.handleSearchParamsChanged();
      },

      advancedSearchQueriesForEntityLookUp() {
        const qasToLookUp = this.advancedSearchRulesFromRouteQuery()
          .filter(query => {
            const fieldNeedsLookUp = this.advancedSearchFieldsForEntityLookUp.map(field => field?.name).includes(query?.field);
            const newQuery = !this.qasWithAddedEntityValue.find(qaWithEntity => isEqual(qaWithEntity.qa, query));

            return fieldNeedsLookUp && newQuery;
          });
        return qasToLookUp;
      },

      async lookupQaEntity(query) {
        const locale = this.$i18n.locale;
        let queryEqualsEntity;
        const text = query.term;

        // Check if term is selected and stored from the entity dropdown
        const queryHasSelectedEntity = this.qasWithSelectedEntityValue.find(queryWithSelectedEntity => queryWithSelectedEntity.qa === text);
        queryEqualsEntity = queryHasSelectedEntity;

        // Look up possible entity value for SSR or when no option selected, the qa might still match an entity
        if (!queryHasSelectedEntity) {
          const suggestions = await this.$apis.entity.suggest(text, {
            language: locale,
            // Only look up specific entity type as defined for the advanced search field
            type: query.suggestEntityType
          });

          queryEqualsEntity = suggestions.find(entity => entity.prefLabel[locale].toLowerCase() === text.toLowerCase());
        }

        if (queryEqualsEntity) {
          const qae = this.advancedSearchQueryFromRule({ ...query, term: `"${queryEqualsEntity.id}"` });
          return {
            qa: query,
            qae
          };
        } else {
          // save fields that do not match entity to prevent reattempt to find matching entitiy
          return {
            qa: query,
            qae: null
          };
        }
      },

      async addEntityValuesToAdvancedSearchFields(qas) {
        const fieldsWithEntityValues = await Promise.all(qas.map(this.lookupQaEntity));

        // Save the enriched queries to data prop (local store) to prevent repeated suggest requests
        if (fieldsWithEntityValues.length) {
          this.qasWithAddedEntityValue = this.qasWithAddedEntityValue.concat(fieldsWithEntityValues);
        }

        // Clean up the store to prevent accumulating outdated data
        this.$store.commit('search/setQasWithSelectedEntityValue', []);
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/transitions';

.search-page-container {
  max-width: none;
  padding-top: 0.875rem;

  @media (min-width: $bp-4k) {
    padding-top: 1.5rem;
  }
}

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

.search-bar-open {
  padding-top: 4.275rem !important;

  @media (min-width: $bp-4k) {
    padding-top: 6.6rem !important;
  }
}
</style>
