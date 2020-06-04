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
        <SearchInterface
          :per-row="4"
        />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import axios from 'axios';

  import SearchInterface from '../../components/search/SearchInterface';
  import { pageFromQuery } from '../../plugins/utils';
  import legacyUrl from '../../plugins/europeana/legacy-search';
  import NotificationBanner from '../../components/generic/NotificationBanner';

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
    computed: {
      notificationUrl() {
        return legacyUrl(this.$route.query, this.$store.state.i18n.locale) +
          '&utm_source=new-website&utm_medium=button';
      },
      redirectNotificationsEnabled() {
        return Boolean(Number(process.env.ENABLE_LINKS_TO_CLASSIC));
      }
    },
    async fetch({ app, error, store, query, res }) {
      const fetchLinkGroups = !store.state['link-group'].data.mainNavigation;
      const contentfulVariables = {
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview',
        linkGroups: fetchLinkGroups
      };

      await store.dispatch('search/activate');
      store.commit('search/set', ['userParams', query]);

      return axios.all(
        [store.dispatch('search/run')]
          .concat(fetchLinkGroups ? app.$contentful.query('linkGroups', contentfulVariables) : () => {})
      )
        .then(axios.spread((searchResponse, contentfulResponse) => {
          if (fetchLinkGroups) store.commit('link-group/setLinks', contentfulResponse.data.data);
          if (store.state.search.error && res !== undefined) {
            res.statusCode = store.state.search.errorStatusCode;
          }
        }))
        .catch((e) => {
          const statusCode = (e.statusCode !== undefined) ? e.statusCode : 500;
          error({ statusCode, message: e.toString() });
        });
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
