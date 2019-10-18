<template>
  <b-container data-qa="blog">
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <h1>Blogs</h1>
      </b-col>
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="blog posts"
        >
          <BlogContentCard
            v-for="(post, index) in posts"
            :key="index"
            :title="post.fields.headline"
            :url="`/blog/${post.fields.identifier}`"
            image-url="https://picsum.photos/600/300/?image=25"
            :description="post.fields.description"
            :datetime="post.fields.datePublished"
          />
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNav
          v-if="showPagination"
          v-model="page"
          :limit="perPage"
          :total-results="total"
          :per-page="perPage"
          :link-gen="paginationLink"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import createClient from '../../plugins/contentful';
  import BlogContentCard from '../../components/blog/BlogContentCard';
  import PaginationNav from '../../components/generic/PaginationNav';

  export default {
    name: 'BlogFoyer',

    components: {
      BlogContentCard,
      PaginationNav
    },

    head() {
      return {
        title: 'Blog'
      };
    },

    data() {
      return {
        perPage: 10,
        page: Number(this.$route.query.page)
      };
    },

    computed: {
      showPagination() {
        return this.total > this.perPage;
      }
    },

    asyncData({ query, redirect, error, app }) {
      const contentfulClient = createClient(query.mode);
      const currentPage = query && query.page;
      const limit = 10;

      if (!currentPage) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({ name: 'blog', query }));
      }

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'blogPosting',
        'skip': (Number(currentPage) - 1) * limit,
        limit
      })
        .then((response) => {
          if (response.total === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          return {
            posts: response.items,
            total: response.total
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    methods: {
      paginationLink(val) {
        return this.localePath({ name: 'blog', query: { page: val } });
      }
    },

    watchQuery: ['page']
  };
</script>
