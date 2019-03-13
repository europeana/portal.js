<template>
  <div class="mt-3">
    {{ facets }}
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
    >
      {{ selectedFacet.facetName }}: {{ selectedFacet.fieldValue }}
    </b-badge>
  </div>
</template>

<script>
  export default {
    props: {
      facets: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      facetList: function() {
        console.log('computing facetList');
        let listOfFacets = [];
        for (let facetName in this.facets) {
          for (let fieldValue of this.facets[facetName]) {
            listOfFacets.push({ key: `${facetName}:${fieldValue}`, facetName: facetName, fieldValue: fieldValue });
          }
        }
        return listOfFacets;
      }
    }
  };
</script>
