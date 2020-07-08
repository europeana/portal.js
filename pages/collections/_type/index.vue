<template>
  <b-container>
    <ContentHeader
      :title="$tc('entity.index.' + this.$route.params.type, 2)"
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
            :url="entityRoute(entity)"
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
  import {
    getEntityIndex,
    getEntitySlug,
    getEntityTypeHumanReadable
  } from '../../../plugins/europeana/entity';

  const PER_PAGE = 24;
  export default {
    name: 'CollectionTypeIndexPage',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNav: () => import('../../../components/generic/PaginationNav')
    },
    asyncData({ query, params, redirect, error, app }) {
      const currentPage = pageFromQuery(query.page);
      if (!['persons', 'topics'].includes(params.type)) {
        return  error({ statusCode: 404, message: 'unknown collection type' });
      }
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.$path({ name: 'collections-type', params: { type: params.type }, query }));
      }
      const entityIndexParams = {
        query: '*:*',
        page: currentPage - 1,
        type: params.type.slice(0, -1),
        pageSize: PER_PAGE,
        scope: 'europeana'
      };
      return getEntityIndex(entityIndexParams)
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
    methods: {
      paginationLink(val) {
        return this.$path({ name: 'collections-type', params: { type: this.$route.params.type }, query: { page: val } });
      },
      entityRoute(entity) {
        console.log(entity);
        return {
          name: 'collections-type-all',
          params: {
            type: getEntityTypeHumanReadable(entity.type),
            pathMatch: getEntitySlug(entity.id, entity.prefLabel.en)
          }
        };
      }
    },
    head() {
      return {
        title: this.$tc('entity.index.'  + this.$route.params.type, 2)
      };
    },
    watchQuery: ['query', 'page']
  };
</script>
