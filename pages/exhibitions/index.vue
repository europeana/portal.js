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
            :image-url="imageUrl(exhibition.fields.primaryImageOfPage)"
            :image-content-type="imageContentType(exhibition.fields.primaryImageOfPage)"
            :image-optimisation-options="{ width: 510 }"
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
  import { pageFromQuery } from '../../plugins/utils';

  const PER_PAGE = 20;

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
        perPage: PER_PAGE,
        page: null
      };
    },
    computed: {
      showPagination() {
        return this.total > this.perPage;
      }
    },
    asyncData({ query, redirect, error, app, store }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({ name: 'exhibitions', query }));
      }

      const contentfulClient = createClient(query.mode);
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionPage',
        'skip': (currentPage - 1) * PER_PAGE,
        // TODO refactor this to use firstPublishedAt, which is not searchable and may require a custom field + webhook
        'order': '-sys.createdAt',
        limit: PER_PAGE
      })
        .then((response) => {
          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text:  app.i18n.t('exhibitions.exhibitions'),
              active: true
            }
          ]);
          return {
            exhibitions: response.items,
            total: response.total,
            page: currentPage,
            perPage: PER_PAGE
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    methods: {
      paginationLink(val) {
        return this.localePath({ name: 'exhibitions', query: { page: val } });
      },
      imageUrl(image) {
        if (!image) return;
        if (!image.fields.image) return;
        if (!image.fields.image.fields.file) return;
        return image.fields.image.fields.file.url;
      },
      imageContentType(image) {
        if (!image) return;
        if (!image.fields.image) return;
        if (!image.fields.image.fields.file) return;
        return image.fields.image.fields.file.contentType;
      }
    },
    watchQuery: ['page'],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
