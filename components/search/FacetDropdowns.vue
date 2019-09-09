<template>
    
</template>

<script>
  import FacetDropdown from './FacetDropdown.vue';

  export default {
    components: {
      FacetDropdown
    },

    props: {
      facets: {
        type: Array,
        required: true
      },

      selectedFacets: {
        type: [Array, Object],
        required: false,
        default: () => []
      }
    }
  };
</script>
