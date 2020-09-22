<template>
  <div
    data-qa="blog post"
    class="text-page figure-attribution"
  >
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8 pt-large"
        >
          <BlogPost
            :date-published="post.datePublished"
            :title="post.name"
            :description="post.description"
            :body="post"
            :identifier="post.identifier"
            :hero="hero"
            :hero-image="heroImage"
            :authors="post.authorCollection.items.length > 0 ? post.authorCollection.items : null"
          />
          <BlogTags
            v-if="post.keywords"
            :tags="post.keywords"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BlogPost from '../../components/blog/BlogPost';

  export default {
    components: {
      BlogPost,
      BlogTags: () => import('../../components/blog/BlogTags')
    },

    asyncData({ params, query, error, app, store }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('blogPostPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.blogPostingCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
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
        error: null
      };
    },

    computed: {
      hero() {
        return this.post.primaryImageOfPage ? this.post.primaryImageOfPage : null;
      },
      heroImage() {
        return this.hero ? this.hero.image : null;
      },

      ...mapGetters({
        shareUrl: 'http/canonicalUrl',
        identifier: 'http/canonicalUrlWithoutLocale'
      })
    },

    head() {
      return {
        title: this.post.name,
        meta: [
          { hid: 'title', name: 'title', content: this.post.name },
          { hid: 'og:title', property: 'og:title', content: this.post.name }
        ].concat(this.post.description ? [
          { hid: 'description', name: 'description', content: this.post.description },
          { hid: 'og:description', property: 'og:description', content: this.post.description }
        ] : [])
      };
    },

    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
