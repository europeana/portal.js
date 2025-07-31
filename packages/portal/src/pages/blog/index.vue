<template>
  <LoadingSpinner
    v-if="$fetchState.pending"
    class="flex-md-row py-4 text-center"
  />
  <ErrorMessage
    v-else-if="$fetchState.error"
    data-qa="error message container"
    :error="$fetchState.error"
  />
  <ContentHubPage
    v-else
    data-qa="blog"
    :page-meta="pageMeta"
    :items="posts"
    :total="total"
    :per-page="perPage"
    :title="$t('blog.blog')"
    card-url-name="blog-all"
  />
</template>

<script>

  import pageMetaMixin from '@/mixins/pageMeta';
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import blogFoyerPageGraphql from '@/graphql/queries/blogFoyerPage.graphql';

  const PER_PAGE = 24;

  export default {
    name: 'BlogIndexPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      ContentHubPage
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        perPage: PER_PAGE,
        posts: null,
        total: null
      };
    },

    async fetch() {
      try {
        const variables = {
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview',
          limit: PER_PAGE,
          skip: (this.page - 1) * PER_PAGE
        };

        const response = await this.$contentful.query(blogFoyerPageGraphql, variables);
        const data = response.data;

        this.posts = data.blogPostingCollection.items;
        this.total = data.blogPostingCollection.total;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },

    computed: {
      page() {
        return Number(this.$route.query.page || 1);
      },
      pageMeta() {
        return {
          title: this.$t('blog.blog'),
          ogImage: this.socialMediaImage?.url,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      socialMediaImage() {
        return this.posts?.[0]?.primaryImageOfPage?.image;
      }
    },

    watch: {
      '$route.query.page'() {
        this.$fetch();
      }
    }
  };
</script>
