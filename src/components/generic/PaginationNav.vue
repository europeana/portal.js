<template>
  <b-pagination-nav
    v-if="totalResults > perPage"
    v-model="page"
    :limit="limit"
    :hide-ellipsis="hideEllipsis"
    :number-of-pages="totalPages"
    :link-gen="linkGen"
    use-router
    size="sm"
    align="center"
    data-qa="pagination navigation"
    @input="changePaginationNav"
  />
</template>

<script>
  import { BPaginationNav } from 'bootstrap-vue';

  export default {
    name: 'PaginationNav',

    components: {
      BPaginationNav
    },

    props: {
      perPage: {
        type: Number,
        default: 24
      },
      limit: {
        type: Number,
        default: 12
      },
      hideEllipsis: {
        type: Boolean,
        default: true
      },
      totalResults: {
        type: Number,
        default: 0
      },
      scrollToId: {
        type: String,
        default: 'header'
      },
      maxResults: {
        type: Number,
        default: null
      }
    },

    computed: {
      totalPages() {
        const atLeastOne = Math.max(this.totalResults, 1);
        return Math.ceil(Math.min(atLeastOne, this.maxResults || atLeastOne) / this.perPage);
      },

      page() {
        return Number(this.$route?.query?.page) || 1;
      }
    },

    methods: {
      changePaginationNav() {
        this.$scrollTo(`#${this.scrollToId}`);
      },

      linkGen(page) {
        return {
          ...this.$route,
          query: { ...this.$route.query, page }
        };
      }
    }
  };
</script>
