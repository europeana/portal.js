<template>
  <b-list-group
    data-qa="search results list"
  >
    <b-list-group-item
      v-for="result in results"
      :key="result.europeanaId"
      :to="localePath({ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } })"
      class="flex-column align-items-start mb-3"
      data-qa="search result"
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
      value: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        results: this.value
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.results = val;
        }
      }
    }
  };
</script>
