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
        </b-col>
        <b-container v-if="relatedCollections.length > 0">
          <h2 class="related-heading text-uppercase mt-4 mb-2">
            {{ $t('relatedCollections') }}
          </h2>
          <RelatedChip
            v-for="relatedCollection in relatedCollections"
            :id="relatedCollection.id"
            :key="relatedCollection.id"
            :link-gen="suggestionLinkGen"
            :title="relatedCollection.prefLabel.en"
          />
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
  import { getEntitySuggestions, getEntityTypeHumanReadable, getEntitySlug } from '../../plugins/europeana/entity';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      SearchInterface,
      NotificationBanner,
      RelatedChip
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    middleware({ query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.$path({ name: 'search', query: { ...query, ...{ page: '1' } } }));
      }
    },
    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),
      notificationUrl() {
        return legacyUrl(this.$route.query, this.$store.state.i18n.locale) +
          '&utm_source=new-website&utm_medium=button';
      },
      redirectNotificationsEnabled() {
        return Boolean(Number(process.env.ENABLE_LINKS_TO_CLASSIC));
      }
    },

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
      this.getSearchSuggestions(this.$route.query.query);
    },

    methods: {
      async getSearchSuggestions(query) {

        // Query in the user's language, removing duplicates
        const languageParam = Array.from(new Set([this.$i18n.locale])).join(',');

        const suggestions = await getEntitySuggestions(query, {
          language: languageParam
        }, {
          recordValidation: this.enableSuggestionValidation
        });

        let i = 0;
        while (i < 4) {
          this.relatedCollections.push(suggestions[i]);
          i++;
        }
      },

      suggestionLinkGen(entityUri) {
        const entity = {
          id: entityUri,
          prefLabel: this.relatedCollections[entityUri]
        };
        const uriMatch = entityUri.match(`^${this.apiConfig.data.origin}/([^/]+)(/base)?/(.+)$`);
        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            // TODO: use stored entity/curatedEntities for prefLabel, if set
            pathMatch: getEntitySlug(entity.id, entity.prefLabel)
          }
        });
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
