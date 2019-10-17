<template>
  <b-container data-qa="blog post">
    <b-row class="flex-md-row pb-5">
      <b-col
        cols="12"
        md="9"
      >
        <BlogPost
          :date-published="page.datePublished"
          :title="page.headline"
          :body="page.articleBody"
        />
        <BlogTags
          v-if="page.keywords"
          :tags="page.keywords"
        />
      </b-col>
      <b-col
        cols="12"
        md="3"
        class="pb-3"
      >
        <BlogAuthors
          v-if="page.author"
          :authors="page.author"
        />
        <BlogCategories :categories="page.genre" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import createClient from '../../plugins/contentful';
  import BlogPost from '../../components/blog/BlogPost';
  import BlogTags from '../../components/blog/BlogTags';
  import BlogAuthors from '../../components/blog/BlogAuthors';
  import BlogCategories from '../../components/blog/BlogCategories';

  export default {
    components: {
      BlogPost,
      BlogTags,
      BlogAuthors,
      BlogCategories
    },

    data() {
      return {
        error: null
      };
    },

    head() {
      return {
        title: this.page.headline
      };
    },

    asyncData({ params, query, error, app, store }) {
      const contentfulClient = createClient(query.mode);

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'blogPosting',
        'fields.identifier': params.pathMatch,
        'limit': 1
      })
        .then((response) => {
          if (response.total === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          store.commit('breadcrumb/setBreadcrumb', {
            text: response.items[0].fields.headline,
            active: true
          });

          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
