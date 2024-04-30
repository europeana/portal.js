<template>
  <b-container
    data-qa="exhibitions"
  >
    <ContentHeader
      :title="pageMeta.title"
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
            v-for="exhibition in exhibitions"
            :key="exhibition.identifier"
            :title="exhibition.name"
            :url="{ name: 'exhibitions-exhibition', params: { exhibition: exhibition.identifier } }"
            :image-url="imageUrl(exhibition.primaryImageOfPage)"
            :image-content-type="imageContentType(exhibition.primaryImageOfPage)"
            :image-optimisation-options="{ width: 510 }"
            :image-alt="imageAlt(exhibition.primaryImageOfPage)"
            :texts="[exhibition.description]"
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
    name: 'ExhibitionsIndexPage',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNavInput
    },
    mixins: [pageMetaMixin],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },

    middleware: 'sanitisePageQuery',

    asyncData({ query, error, app, store }) {
      const variables = {
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview',
        limit: PER_PAGE,
        skip: (store.state.sanitised.page - 1) * PER_PAGE
      };

      return app.$contentful.query('exhibitionFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          return {
            exhibitions: data.exhibitionPageCollection.items,
            total: data.exhibitionPageCollection.total,
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
          title: this.$tc('exhibitions.exhibitions', 2)
        };
      }
    },
    watchQuery: ['page'],
    methods: {
      imageUrl(image) {
        return image?.image?.url;
      },
      imageContentType(image) {
        return image?.image?.contentType;
      },
      imageAlt(image) {
        return image?.image?.description || '';
      }
    }
  };
</script>
