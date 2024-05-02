<template>
  <b-container data-qa="blog">
    <ContentHeader
      :title="pageMeta.title"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="blog posts section"
        >
          <ContentCard
            v-for="(post, index) in posts"
            :key="index"
            :title="post.name"
            :url="{ name: 'blog-all', params: { pathMatch: post.identifier } }"
            :image-url="imageUrl(post)"
            :image-content-type="imageContentType(post)"
            :image-optimisation-options="{ width: 510 }"
            :image-alt="imageAlt(post)"
            :texts="[post.description]"
            :show-subtitle="false"
          />
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNavInput
          :total-results="total"
          :per-page="perPage"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '../../components/content/ContentHeader';
  import ContentCard from '../../components/content/ContentCard';
  import PaginationNavInput from '../../components/generic/PaginationNavInput';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 20;

  export default {
    name: 'BlogIndexPage',

    components: {
      ContentHeader,
      ContentCard,
      PaginationNavInput
    },

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    asyncData({ query, error, app, store }) {
      const variables = {
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview',
        limit: PER_PAGE,
        skip: (store.state.sanitised.page - 1) * PER_PAGE
      };

      return app.$contentful.query('blogFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          return {
            posts: data.blogPostingCollection.items,
            total: data.blogPostingCollection.total,
            page: store.state.sanitised.page,
            perPage: PER_PAGE
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    data() {
      return {
        perPage: PER_PAGE,
        page: null
      };
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('blog.blog')
        };
      }
    },

    watchQuery: ['page'],

    methods: {
      imageUrl(post) {
        return post.primaryImageOfPage?.image?.url || null;
      },
      imageContentType(post) {
        return post.primaryImageOfPage?.image?.contentType || null;
      },
      imageAlt(post) {
        return post.primaryImageOfPage?.image?.description || '';
      }
    }
  };
</script>
