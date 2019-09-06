<template>
  <ul
    class="list-unstyled"
    data-qa="facet dropdowns"
  >
    <FacetDropdown
      v-for="facet in facets"
      :key="facet.name"
      :facet="facet"
      :selected-facet="selectedFacets[facet.name]"
    />
  </ul>
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
