<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <template v-if="selectedFacet.facetName === 'contentTier' && selectedFacet.fieldValue === '*'">
        {{ $t(`facets.${selectedFacet.facetName}.name`) }}
      </template>
      <template v-else-if="$te(`facets.${selectedFacet.facetName}.options`)">
        {{ $t('formatting.labelledValue', { label: $t(`facets.${selectedFacet.facetName}.name`), value: $t(`facets.${selectedFacet.facetName}.options.${selectedFacet.fieldValue}`)}) }}
      </template>
      <template v-else>
        {{ $t('formatting.labelledValue', { label: $t(`facets.${selectedFacet.facetName}.name`), value: selectedFacet.fieldValue}) }}
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
            let fieldValue = this.facets[facetName] ? this.facets[facetName] : 'all';
            if (fieldValue !== 'all') {
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
    }
  };
</script>
