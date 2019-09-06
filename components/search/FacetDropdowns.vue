<template>
  <ul
    class="list-unstyled"
    data-qa="facet dropdowns"
  >
    <FacetDropdown
      v-for="facet in facets"
      :key="facet.name"
      :facet="facet"
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
      }
    }
  };
</script>
