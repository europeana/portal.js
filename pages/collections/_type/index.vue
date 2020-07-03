<template>
  <b-container>
    <ContentHeader
      :title="$tc('entity.index.subjects', 2)"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          :data-qa="`${ this.$route.params.type} listing page`"
        >
          <ContentCard
            v-for="entity in entities"
            :key="entity.id"
            :title="entity.prefLabel[$i18n.locale]"
            :url="entity.id"
            :image-url="typeof entity.isShownBy !== 'undefined' ? entity.isShownBy.thumbnail : '/'"
            variant="mini"
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
  import ContentHeader from '../../../components/generic/ContentHeader';
  import ContentCard from '../../../components/generic/ContentCard';
  import { pageFromQuery } from '../../../plugins/utils';
  import { getEntityIndex } from '../../../plugins/europeana/entity';
  const PER_PAGE = 24;
  export default {
    name: 'CollectionTypeIndexPage',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNav: () => import('../../../components/generic/PaginationNav')
    },
    head() {
      return {
        title: this.$tc('entity.index.subjects', 2)
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
      },
      route() {
        return {
          name: 'collections-index',
          params: {
            pathMatch: this.$route.params.type
          }
        };
      }
    },
    asyncData({ query, params, redirect, error, app }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.$path({ name: 'collections-type', params: { type: this.$route.params.type }, query }));
      }
      const eParams = {
        query: '*:*',
        page: currentPage - 1,
        type: params.type.slice(0, -1),
        pageSize: PER_PAGE,
        scope: 'europeana'
      };
      return getEntityIndex(eParams, 'topic')
        .then(response => response)
        .then(data => {
          return {
            entities: data.entities,
            total: data.total,
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
        return this.$path({ name: 'collections-type', params: { type: this.$route.params.type }, query: { page: val } });
      }
    },
    watchQuery: ['query', 'page']
  };
</script>
