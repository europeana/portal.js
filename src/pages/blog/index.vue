<template>
  <b-container data-qa="blog">
    <ContentHeader
      :title="$t('blog.blog')"
    />
    <b-row
       v-if="$fetchState.pending"
       class="flex-md-row py-4 text-center"
     >
      <b-col cols="12">
        <LoadingSpinner />
      </b-col>
    </b-row>
    <b-row
      v-else-if="$fetchState.error"
      class="flex-md-row py-4"
    >
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
    <template v-else>
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
          <PaginationNav
            :limit="perPage"
            :total-results="total"
            :per-page="perPage"
          />
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
  import AlertMessage from '@/components/generic/AlertMessage';
  import ContentHeader from '@/components/generic/ContentHeader';
  import ContentCard from '@/components/generic/ContentCard';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';

  const PER_PAGE = 20;

  export default {
    name: 'BlogIndexPage',

    components: {
      AlertMessage,
      ContentHeader,
      ContentCard,
      LoadingSpinner,
      PaginationNav: () => import('@/components/generic/PaginationNav')
    },

    middleware: 'sanitisePageQuery',

    fetch() {
      const variables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        limit: PER_PAGE,
        skip: (this.$store.state.sanitised.page - 1) * PER_PAGE
      };

      return this.$contentful.query('blogFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          this.posts = data.blogPostingCollection.items;
          this.total = data.blogPostingCollection.total;
          this.page = this.$store.state.sanitised.page;
        })
        .catch((error) => {
          if (process.server && error.statusCode) {
            this.$nuxt.context.res.statusCode = error.statusCode;
          }
          throw error;
        });
    },

    data() {
      return {
        perPage: PER_PAGE,
        page: null,
        posts: [],
        total: 0
      };
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.$t('blog.blog'))
      };
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
