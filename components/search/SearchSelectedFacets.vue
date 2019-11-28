<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <!-- TODO: move these if/else-if/else elements into a `badgeLabel` computed method -->
      <template v-if="selectedFacet.facetName === 'contentTier' && selectedFacet.fieldValue === '*'">
        {{ $t(`facets.${selectedFacet.facetName}.name`) }}
      </template>
      <template v-else-if="$te(`facets.${selectedFacet.facetName}.options.${selectedFacet.fieldValue}`)">
        {{ $t('formatting.labelledValue', { label: $tc(`facets.${selectedFacet.facetName}.name`, 1), value: localiseFilterLabel(selectedFacet.facetName, selectedFacet.fieldValue)}) }}
      </template>
      <template v-else>
        {{ $t('formatting.labelledValue', { label: $tc(`facets.${selectedFacet.facetName}.name`, 1), value: selectedFacet.fieldValue}) }}
      </template>
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
      localiseFilterLabel(facetName, label) {
        const key = `facets.${facetName}.options.${label}`;
        return this.$te(key) ? this.$t(key) : label;
      }
    }
  };
</script>
