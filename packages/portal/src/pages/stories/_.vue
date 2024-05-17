<template>
  <div
    data-qa="story page"
    class="text-page white-page "
  >
    <ContentWarningModal
      v-if="post.contentWarning"
      :title="post.contentWarning.name"
      :description="post.contentWarning.description"
      :page-slug="`stories/${post.identifier}`"
    />
    <StoryPost
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
  import StoryPost from '@/components/story/StoryPost';
  import logEventMixin from '@/mixins/logEvent';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';

  export default {
    name: 'StoriesPage',

    components: {
      StoryPost,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal')
    },

    mixins: [
      canonicalUrlMixin,
      pageMetaMixin,
      logEventMixin
    ],

    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },

    // TODO: port to use `fetch`
    asyncData({ params, query, error, app, store, redirect }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('storyPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.storyCollection.items.length === 0) {
            return redirect(302, '/stories');
          }

          const post = data.storyCollection.items[0];

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              // TODO: Add named language aware route for stories index
              text: app.i18n.t('storiesPage.title'),
              to: '/stories'
            },
            {
              text: post.name,
              active: true
            }
          ]);

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
