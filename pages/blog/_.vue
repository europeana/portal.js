<template>
  <div
    data-qa="blog post"
    class="blog-post mx-auto figure-attribution"
  >
    <b-container
      fluid
      class="image-wrapper"
    >
      <b-row class="flex-md-row pb-5">
        <b-col cols="12">
          <BlogPost
            :date-published="post.datePublished"
            :title="post.name"
            :description="post.description"
            :body="post.articleBody"
            :identifier="post.identifier"
            :hero="hero"
            :hero-image="heroImage"
            :authors="post.authorCollection.items.length > 0 ? post.authorCollection.items : null"
          />
          <BlogTags
            v-if="post.keywords"
            :tags="post.keywords"
          />
          <div
            v-if="enableBlogComments"
            class="mt-4"
            data-qa="disqus widget"
          >
            <vue-disqus
              :shortname="disqusShortname"
              :identifier="identifier"
              :url="shareUrl"
            />
          </div>
        </b-col>
      </b-row>
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
      }),

      disqusShortname() {
        return process.env.DISQUS_SHORTNAME;
      },

      enableBlogComments() {
        return !!this.disqusShortname;
      }
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

