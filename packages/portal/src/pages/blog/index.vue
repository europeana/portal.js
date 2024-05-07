<template>
  <ContentHubPage
    data-qa="blog"
    :page-meta="pageMeta"
    :items="posts"
    :total="total"
    :per-page="perPage"
    card-url-name="blog-all"
  />
</template>

<script>

  import pageMetaMixin from '@/mixins/pageMeta';
  import ContentHubPage from '@/components/content/ContentHubPage.vue';

  const PER_PAGE = 24;

  export default {
    name: 'BlogIndexPage',

    components: {
      ContentHubPage
    },

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    asyncData({ query, error, app, store }) {
      const variables = {
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview',
        limit: PER_PAGE,
        skip: (store.state.sanitised.page - 1) * PER_PAGE
      };

      return app.$contentful.query('blogFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          return {
            posts: data.blogPostingCollection.items,
            total: data.blogPostingCollection.total,
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
          title: this.$t('blog.blog'),
          ogImage: this.socialMediaImage?.url,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      socialMediaImage() {
        return this.posts[0]?.primaryImageOfPage?.image;
      }
    },

    watchQuery: ['page']
  };
</script>

