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
        <b-container v-if="relatedCollections">
          <h2 class="related-heading text-uppercase mt-4 mb-2">
            {{ $t('relatedCollections') }}
          </h2>
          <RelatedChip
            v-for="relatedCollection in relatedCollections"
            :key="relatedCollection.id"
            :link-to="localePath({
              name: 'entity-type-all',
              params: {
                type: relatedCollection.type,
                pathMatch: relatedCollection.id
              }
            })"
            :title="relatedCollection.prefLabel.en"
            img="https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fcollections.rmg.co.uk%2FmediaLib%2F342%2Fmedia-342570%2Flarge.jpg"
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
  import { mapState } from 'vuex';

  export default {
    components: {
      SearchInterface,
      NotificationBanner,
      RelatedChip
    },

    middleware({ query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.$path({ name: 'search', query: { ...query, ...{ page: '1' } } }));
      }
    },
    computed: {
      ...mapState({
        relatedCollections: state => state.search.relatedCollections
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
