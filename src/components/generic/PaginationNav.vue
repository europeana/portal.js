<template>
  <b-pagination-nav
    v-if="totalResults > perPage"
    v-model="currentPage"
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
  export default {
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
      value: {
        type: Number,
        default: 1
      },
      scrollToId: {
        type: String,
        default: '__nuxt'
      },
      maxResults: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        currentPage: this.value
      };
    },
    computed: {
      totalPages() {
        const atLeastOne = Math.max(this.totalResults, 1);
        return Math.ceil(Math.min(atLeastOne, this.maxResults || atLeastOne) / this.perPage);
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          // Without this, using the browser back button will not update the highlighted pagination
          this.currentPage = val;
        }
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
