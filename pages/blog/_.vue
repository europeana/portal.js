<template>
  <b-container data-qa="blog post">
    <b-row class="flex-md-row pb-5">
      <b-col
        cols="12"
        md="9"
      >
        <BlogPost
          :title="page.headline"
          :body="page.articleBody"
        />
        <TagAndShare
          v-if="page.keywords"
          :tags="page.keywords"
        />
        <RelatedPosts />
      </b-col>
      <b-col
        cols="12"
        md="3"
        class="pb-3"
      >
        <Authors
          v-if="page.author"
          :authors="page.author"
        />
        <Categories :categories="page.genre" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import createClient from '../../plugins/contentful';
  import BlogPost from '../../components/blog/BlogPost';
  import TagAndShare from '../../components/blog/TagAndShare';
  import Authors from '../../components/blog/Authors';
  import RelatedPosts from '../../components/blog/RelatedPosts';
  import Categories from '../../components/blog/Categories';

  export default {
    layout: 'blog',

    components: {
      BlogPost,
      TagAndShare,
      Authors,
      RelatedPosts,
      Categories
    },

    data() {
      return {
        error: null
      };
    },

    asyncData({ params, query, error, app, store }) {
      const contentfulClient = createClient(query.mode);

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'blogPosting',
        'sys.id': params.pathMatch
      })
        .then((response) => {
          if (response.total === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          store.commit('setBreadcrumb', [
            {
              text: 'Blog',
              href: '#'
            },
            {
              text: response.items[0].fields.headline,
              active: true
            }
          ]);
          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    }
  };
</script>
