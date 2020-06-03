<template>
  <div>
    <NotificationBanner
      v-if="redirectNotificationsEnabled"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.search.text')"
      :notification-link-text="$t('linksToClassic.search.linkText')"
      class="mb-3"
    />
    <b-container data-qa="search page">
      <b-row>
        <b-col>
          <h1>{{ $t('search') }}</h1>
          <RelatedChip
            link-to="/"
            title="Venice"
          />
        </b-col>
        <b-container>
          <h4>Related Collections</h4>
        </b-container>
        <SearchInterface
          :per-row="4"
        />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SearchInterface from '../../components/search/SearchInterface';
  import { pageFromQuery } from '../../plugins/utils';
  import legacyUrl from '../../plugins/europeana/legacy-search';
  import NotificationBanner from '../../components/generic/NotificationBanner';
  import RelatedChip from '../../components/search/RelatedChip';
  import { getEntitySuggestions } from '../../plugins/europeana/entity';

  export default {
    components: {
      SearchInterface,
      NotificationBanner
    },

    middleware({ query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.$path({ name: 'search', query: { ...query, ...{ page: '1' } } }));
      }
    },
    data() {
      return {
        relatedEntities: null
      };
    },
    computed: {
      notificationUrl() {
        return legacyUrl(this.$route.query, this.$store.state.i18n.locale) +
          '&utm_source=new-website&utm_medium=button';
      },
      redirectNotificationsEnabled() {
        return Boolean(Number(process.env.ENABLE_LINKS_TO_CLASSIC));
      }
    },

    // asyncData({ env, query, params, res, store }) {
    //   const entityUri = entities.getEntityUri(params.type, params.pathMatch);
    //   // Prevent re-requesting entity content from APIs if already loaded,
    //   // e.g. when paginating through entity search results
    //   if (entityUri === store.state.entity.id) {
    //     return {
    //       relatedEntities: store.state.entity.relatedEntities
    //     };
    //   }
    //   return axios.all([
    //     entities.relatedEntities(params.type, params.pathMatch, {
    //       wskey: env.EUROPEANA_API_KEY,
    //       entityKey: env.EUROPEANA_ENTITY_API_KEY
    //     })
    //   ]
    //     .then(axios.spread((entity, related) => {
    //       // Store content for reuse should a redirect be needed, below, or when
    //       // navigating back to this page, e.g. from a search result.
    //       store.commit('entity/setRelatedEntities', related);
    //       return {
    //         relatedEntities: related
    //       };
    //     }))
    //     .catch((error) => {
    //       if (typeof res !== 'undefined') {
    //         res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
    //       }
    //       return { error: error.message };
    //     })
    //   );
    // },

    async fetch({ store, query, res }) {
      await store.dispatch('search/activate');
      store.commit('search/set', ['userParams', query]);

      await store.dispatch('search/run');
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
    },

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
      this.getSearchSuggestions();
    },

    methods: {
      async getSearchSuggestions(query) {
        if (!this.enableAutoSuggest) return;

        // Don't go getting more suggestions if we are already waiting for some
        if (this.gettingSuggestions) return;

        if (query === '') {
          this.suggestions = {};
          return;
        }

        this.gettingSuggestions = true;

        // Query in the user's language, and English, removing duplicates
        const languageParam = Array.from(new Set([this.$i18n.locale, 'en'])).join(',');

        const suggestions = await getEntitySuggestions(query, {
          language: languageParam
        }, {
          recordValidation: this.enableSuggestionValidation
        });

        this.suggestions = suggestions.reduce((memo, suggestion) => {
          memo[suggestion.id] = suggestion.prefLabel;
          return memo;
        }, {});

        this.gettingSuggestions = false;

        // If the query has changed in the meantime, go get new suggestions now
        if (query !== this.query) this.getSearchSuggestions(this.query);
      }
    },

    head() {
      return {
        title: this.$t('search')
      };
    },

    async beforeRouteLeave(to, from, next) {
      await this.$store.dispatch('search/deactivate');
      next();
    },

    watchQuery: ['api', 'reusability', 'query', 'qf', 'page']
  };
</script>
