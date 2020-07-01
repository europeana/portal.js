<template>
  <b-container>
    <ContentHeader
      :title="$tc('subjects.title', 2)"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="subjects page"
        >
          <ContentCard
            v-for="topic in topics"
            :key="topic.id"
            :title="topic.prefLabel[$i18n.locale]"
            :url="topic.id"
            :image-url="typeof topic.isShownBy !== 'undefined' ? topic.isShownBy.thumbnail : '/'"
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
  // import axios from 'axios';
  import ContentHeader from '../../components/generic/ContentHeader';
  import ContentCard from '../../components/generic/ContentCard';
  import { pageFromQuery } from '../../plugins/utils';
  import { getEntitySubjects } from '../../plugins/europeana/entity';

  const PER_PAGE = 24;

  export default {
    name: 'CollectionTopicsPage',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNav: () => import('../../components/generic/PaginationNav')
    },
    head() {
      return {
        title: this.$tc('subjects.title', 2)
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
    asyncData({ query, redirect, error, app }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.$path({ name: 'collections-topics', query }));
      }

      // return axios.get(('https://api.europeana.eu/entity/search'), {
      //   params: {
      //     query: '*:*',
      //     wskey: 'apidemo',
      //     type: 'Concept',
      //     page: currentPage - 1,
      //     pageSize: PER_PAGE,
      //     scope: 'europeana'
      //   }
      // })
      const params = {
        query: '*:*',
        type: 'concept',
        page: currentPage - 1,
        pageSize: PER_PAGE,
        scope: 'europeana'
      };

      return getEntitySubjects(params)
        .then(response => response)
        .then(data => {
          return {
            topics: data.data.items,
            total: data.data.partOf.total,
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
        return this.$path({ name: 'collections-topics', query: { page: val } });
      }
    },
    watchQuery: ['query', 'page']
  };
</script>
