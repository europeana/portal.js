<template>
  <ContentHubPage
    data-qa="exhibitions"
    :page-meta="pageMeta"
    :items="exhibitions"
    :total="total"
    :per-page="perPage"
    card-url-name="exhibitions-exhibition"
  />
</template>

<script>
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 24;

  export default {
    name: 'ExhibitionsIndexPage',
    components: {
      ContentHubPage
    },
    mixins: [pageMetaMixin],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },

    middleware: 'sanitisePageQuery',

    asyncData({ query, error, app, store }) {
      const variables = {
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview',
        limit: PER_PAGE,
        skip: (store.state.sanitised.page - 1) * PER_PAGE
      };

      return app.$contentful.query('exhibitionFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          return {
            exhibitions: data.exhibitionPageCollection.items,
            total: data.exhibitionPageCollection.total,
            page: store.state.sanitised.page,
            perPage: PER_PAGE
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    data() {
      return {
        perPage: PER_PAGE,
        page: null
      };
    },
    computed: {
      pageMeta() {
        return {
          title: this.$tc('exhibitions.exhibitions', 2),
          description: this.$t('exhibitions.description'),
          ogImage: this.socialMediaImage?.url,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      socialMediaImage() {
        return this.exhibitions?.[0]?.primaryImageOfPage?.image;
      }
    },
    watchQuery: ['page']
  };
</script>
