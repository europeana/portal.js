<template>
  <div
    data-qa="blog post"
    class="text-page figure-attribution"
  >
    <ContentWarningModal
      v-if="post.contentWarning"
      :title="post.contentWarning.name"
      :description="post.contentWarning.description"
    />
    <BlogPost
      :date-published="post.datePublished"
      :title="post.name"
      :description="post.description"
      :body="post.hasPartCollection"
      :identifier="post.identifier"
      :hero="hero"
      :authors="post.authorCollection.items.length > 0 ? post.authorCollection.items : null"
      :tags="post.keywords"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BlogPost from '../../components/blog/BlogPost';

  export default {
    name: 'BlogPostPage',

    components: {
      BlogPost,
      ContentWarningModal: () => import('@/components/generic/ContentWarningModal')
    },

    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },

    asyncData({ params, query, error, app, store, redirect }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('blogPostPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.blogPostingCollection.items.length === 0) {
            return redirect(302, '/blog');
          }

          const post = data.blogPostingCollection.items[0];

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              // TODO: Add named language aware route for blog index
              text: app.i18n.t('blog.blog'),
              to: '/blog'
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

    head() {
      return {
        title: this.$pageHeadTitle(this.post.name),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.post.name },
          { hid: 'og:title', property: 'og:title', content: this.post.name }
        ].concat(this.post.description ? [
          { hid: 'description', name: 'description', content: this.post.description },
          { hid: 'og:description', property: 'og:description', content: this.post.description }
        ] : [])
          .concat(this.post.primaryImageOfPage ? [
            { hid: 'og:image', property: 'og:image', content: this.post.primaryImageOfPage.image.url },
            { hid: 'og:image:alt', property: 'og:image:alt', content: this.post.primaryImageOfPage.image.description || '' }
          ] : [])
      };
    },

    computed: {
      hero() {
        return this.post.primaryImageOfPage || null;
      },

      ...mapGetters({
        shareUrl: 'http/canonicalUrl',
        identifier: 'http/canonicalUrlWithoutLocale'
      })
    }
  };
</script>
