<template>
  <div
    data-qa="blog post"
    class="text-page white-page "
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <template v-else>
      <ContentWarningModal
        v-if="post.contentWarning"
        :title="post.contentWarning.name"
        :description="post.contentWarning.description"
        :page-slug="`blog/${post.identifier}`"
      />
      <BlogPost
        :date-published="post.datePublished"
        :title="post.name"
        :description="post.description"
        :body="post.hasPartCollection"
        :identifier="post.identifier"
        :hero="hero"
        :authors="post.authorCollection.items.length > 0 ? post.authorCollection.items : null"
        :tags="post.categoriesCollection && post.categoriesCollection.items"
        :themes="post.genre"
        :related-link="post.relatedLink"
      />
    </template>
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';
  import BlogPost from '@/components/blog/BlogPost';
  import blogPostPageGraphql from '@/graphql/queries/blogPostPage.graphql';

  export default {
    name: 'BlogPostPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      BlogPost,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal')
    },

    mixins: [
      pageMetaMixin
    ],

    data() {
      return {
        post: {}
      };
    },

    async fetch() {
      try {
        const variables = {
          identifier: this.$route.params.pathMatch,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query(blogPostPageGraphql, variables);
        const data = response.data;
        const post = data.blogPostingCollection.items[0];

        if (!post) {
          this.$error(404, { scope: 'page' });
          return;
        }

        this.post = post;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.post.name,
          description: this.post.description,
          ogType: 'article',
          ogImage: this.post.primaryImageOfPage?.image?.url,
          ogImageAlt: this.post.primaryImageOfPage?.image?.description || ''
        };
      },
      hero() {
        return this.post.primaryImageOfPage || null;
      }
    }
  };
</script>
