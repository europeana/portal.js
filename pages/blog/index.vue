<template>
  <b-container data-qa="blog">
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <h1>{{ $t('blog.blog') }}</h1>
      </b-col>
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="blog posts section"
        >
          <ContentCard
            v-for="(post, index) in posts"
            :key="index"
            :title="post.fields.name"
            :url="{ name: 'blog-all', params: { pathMatch: post.fields.identifier } }"
            :image-url="post.fields.primaryImageOfPage && post.fields.primaryImageOfPage.fields.image.fields.file.url"
            :texts="[post.fields.description]"
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

<script>
  import createClient from '../../plugins/contentful';
  import ContentCard from '../../components/generic/ContentCard';
  import PaginationNav from '../../components/generic/PaginationNav';

  export default {
    name: 'BlogFoyer',

    components: {
      ContentCard,
      PaginationNav
    },

    head() {
      return {
        title: this.$t('blog.blog')
      };
    },

    data() {
      return {
        perPage: 20,
        page: Number(this.$route.query.page || 1)
      };
    },

    computed: {
      showPagination() {
        return this.total > this.perPage;
      }
    },

    asyncData({ query, redirect, error, app, store }) {
      const contentfulClient = createClient(query.mode);
      const currentPage = query && query.page;
      const limit = 20;

      if (!currentPage) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({ name: 'blog', query }));
      }

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'blogPosting',
        'skip': (Number(currentPage) - 1) * limit,
        'order': '-fields.datePublished',
        limit
      })
        .then((response) => {
          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text:  app.i18n.t('blog.blog'),
              active: true
            }
          ]);

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

    watchQuery: ['page'],

    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
