<template>
  <b-pagination-nav
    v-model="currentPage"
    :limit="limit"
    :hide-ellipsis="hideEllipsis"
    :number-of-pages="totalPages"
    base-url="#page="
    size="sm"
    align="center"
  />
</template>

<script>

  const maxResults = 1000;

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
      }
    },
    data () {
      return {
        currentPage: null
      };
    },
    computed: {
      totalPages: function () {
        return Math.ceil(Math.min(this.totalResults, maxResults) / this.perPage);
      }
    }
  };
</script>
