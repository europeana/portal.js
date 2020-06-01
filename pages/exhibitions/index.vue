<template>
  <b-container data-qa="exhibitions">
    <ContentHeader
      :title="$tc('exhibitions.exhibitions', 2)"
      :description="$t('exhibitions.description')"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="exhibitions section"
        >
          <ContentCard
            v-for="exhibition in items"
            :key="exhibition.identifier"
            :title="exhibition.name"
            :url="{ name: 'exhibitions-exhibition', params: { exhibition: exhibition.identifier } }"
            :image-url="imageUrl(exhibition.primaryImageOfPage)"
            :image-content-type="imageContentType(exhibition.primaryImageOfPage)"
            :image-optimisation-options="{ width: 510 }"
            :texts="[exhibition.description]"
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
  import ContentHeader from '../../components/generic/ContentHeader';
  // import createClient from '../../plugins/contentful';
  import ContentCard from '../../components/generic/ContentCard';
  import PaginationNav from '../../components/generic/PaginationNav';
  import { pageFromQuery } from '../../plugins/utils';

  const PER_PAGE = 20;

  export default {
    name: 'ExhibitionFoyer',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNav
    },
    head() {
      return {
        title: this.$tc('exhibitions.exhibitions', 2)
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
        return redirect(app.$path({ name: 'exhibitions', query }));
      }

      const fetchLinkGroups = !(store.state['link-group'].data.mainNavigation);
      // TODO: pagination
      const variables = {
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview',
        linkGroups: fetchLinkGroups,
        limit: 20
      };

      return app.$contentful.query('exhibitionFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (fetchLinkGroups) store.commit('link-group/setLinks', data);

          return data.exhibitionPageCollection;
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });

      // const contentfulClient = createClient(query.mode);
      // return contentfulClient.getEntries({
      //   locale: app.i18n.isoLocale(),
      //   'content_type': 'exhibitionPage',
      //   skip: (currentPage - 1) * PER_PAGE,
      //   order: '-fields.datePublished',
      //   limit: PER_PAGE,
      //   select: 'fields.identifier,fields.primaryImageOfPage,fields.name,fields.description'
      // })
      //   .then((response) => {
      //     return {
      //       exhibitions: response.items,
      //       total: response.total,
      //       page: currentPage,
      //       perPage: PER_PAGE
      //     };
      //   })
      //   .catch((e) => {
      //     error({ statusCode: 500, message: e.toString() });
      //   });
    },
    methods: {
      paginationLink(val) {
        return this.$path({ name: 'exhibitions', query: { page: val } });
      },
      imageUrl(image) {
        if (image && image.image) return image.image.url;
      },
      imageContentType(image) {
        if (image && image.image) return image.image.contentType;
      }
    },
    watchQuery: ['page'],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    }
  };
</script>
