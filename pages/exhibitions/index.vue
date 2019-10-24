<template>
  <b-container data-qa="exhibitions">
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <h1>{{ $t('exhibitions.exhibitions') }}</h1>
      </b-col>
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="exhibitions section"
        >
          <ContentCard
            v-for="exhibition in exhibitions"
            :key="exhibition.identifier"
            :title="exhibition.fields.name"
            :url="{ name: 'exhibition-exhibition', params: { exhibition: exhibition.fields.identifier } }"
            :image-url="exhibition.fields.primaryImageOfPage && exhibition.fields.primaryImageOfPage.fields.image.fields.file.url"
            :texts="[exhibition.fields.description]"
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
    name: 'ExhibitionFoyer',
    components: {
      ContentCard,
      PaginationNav
    },
    head() {
      return {
        title: this.$t('exhibitions.exhibitions')
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
        return redirect(app.localePath({ name: 'exhibitions', query }));
      }
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionPage',
        'skip': (Number(currentPage) - 1) * limit,
        // TODO refactor this to use firstPublishedAt, which is not searchable and may require a custom field + webhook
        'order': '-sys.createdAt',
        limit
      })
        .then((response) => {
          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text:  app.i18n.t('exhibitions.exhibitions'),
              current: true
            }
          ]);
          return {
            exhibitions: response.items,
            total: response.total
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    methods: {
      paginationLink(val) {
        return this.localePath({ name: 'exhibitions', query: { page: val } });
      }
    },
    watchQuery: ['page'],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
