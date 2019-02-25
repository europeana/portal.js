<template>
  <b-list-group
    id="searchResults"
  >
    <!-- TODO: switch :href for :to if/when API permits CORS requests to record.json -->
    <b-list-group-item
      v-for="result in results"
      :key="result.europeanaId"
      :href="result.linkTo"
      class="flex-column align-items-start mb-3"
    >
      <SearchResult :result="result" />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import SearchResult from './SearchResult';

  export default {
    components: {
      SearchResult
    },
    props: {
      results: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
