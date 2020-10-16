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
          <i18n
            :path="$route.query.query ? 'searchResultsFor' : 'searchResults'"
            tag="h1"
          >
            <span data-qa="search query">{{ $route.query.query }}</span>
          </i18n>
        </b-col>
        <RelatedSection
          :query="$route.query.query"
          class="mb-4"
        />
        <SearchInterface
          :per-row="4"
        />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SearchInterface from '../../components/search/SearchInterface';
  import legacyUrl from '../../plugins/europeana/legacy-search';
  import NotificationBanner from '../../components/generic/NotificationBanner';

  export default {
    components: {
      SearchInterface,
      NotificationBanner,
      RelatedSection: () => import('../../components/search/RelatedSection')
    },

    middleware: 'sanitisePageQuery',

    async fetch({ store, query, res }) {
      await store.dispatch('search/activate');
      store.commit('search/set', ['userParams', query]);

      await store.dispatch('search/run');
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
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

    mounted() {
      this.$store.commit('search/enableCollectionFacet');
    },

    head() {
      return {
        title: this.$route.query.query ? this.$t('searchResultsFor', [this.$route.query.query]) : this.$t('search')
      };
    },

    async beforeRouteLeave(to, from, next) {
      // Leaving the search page closes the search bar. Reevaluate when autosuggestions go straight to entity pages.
      this.$store.commit('search/setShowSearchBar', false);
      await this.$store.dispatch('search/deactivate');
      next();
    },

    watchQuery: ['api', 'reusability', 'query', 'qf', 'page']
  };
</script>

<style lang="scss" scoped>
  h1 {
    font-size: 1.875rem;
    font-weight: 300;
    line-height: 1.375;
    margin-bottom: 1rem;
    span {
      font-weight: 600;
    }
  }
</style>
