<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      {{ badgeLabel(selectedFacet.facetName, selectedFacet.fieldValue) }}
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
      facetList() {
        let listOfFacets = [];
        for (let facetName in this.facets) {
          if (typeof this.facets[facetName] === 'string') {
            let fieldValue = this.facets[facetName];
            if (fieldValue !== '') {
              listOfFacets.push({ key: `${facetName}:${fieldValue}`, facetName, fieldValue });
            }
          }

          for (let fieldValue of this.facets[facetName]) {
            if (typeof this.facets[facetName] !== 'string') {
              listOfFacets.push({ key: `${facetName}:${fieldValue}`, facetName, fieldValue });
            }
          }
        }

        return listOfFacets;
      }
    },

    methods: {
      badgeLabel(facetName, fieldValue) {
        const label = this.$localiseFilterLabel(facetName, fieldValue);
        return this.$t('formatting.labelledValue', { label: this.$tc(`facets.${facetName}.name`, 1), value: label });
      }
    }
  };
</script>
