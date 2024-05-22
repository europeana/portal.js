<template>
  <div
    data-qa="blog post"
    class="text-page white-page"
  >
    <ContentWarningModal
      v-if="post.contentWarning"
      :title="post.contentWarning.name"
      :description="post.contentWarning.description"
      :page-slug="`stories/${post.identifier}`"
    />
    <StoriesPost
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
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';
  import StoriesPost from '@/components/stories/StoriesPost';
  import logEventMixin from '@/mixins/logEvent';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';

  export default {
    name: 'StoriesPostPage',

    components: {
      StoriesPost,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal')
    },

    mixins: [
      canonicalUrlMixin,
      pageMetaMixin,
      logEventMixin
    ],

    asyncData({ params, query, error, app, redirect }) {
      console.log('params.pathMatch', params.pathMatch);
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('blogPostPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.blogPostingCollection.items.length === 0) {
            return redirect(302, '/blog');
          }

          const post = data.blogPostingCollection.items[0];

          return {
            post
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    data() {
      return {
        post: null,
        error: null
      };
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
    },

    mounted() {
      this.logEvent('view', this.canonicalUrl({ fullPath: true, locale: false }));
    }
  };
</script>
