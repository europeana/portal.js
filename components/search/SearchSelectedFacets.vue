<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <template v-if="selectedFacet.facetName === 'THEME'">
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
      facetList: function() {
        let listOfFacets = [];
        for (let facetName in this.facets) {

          if (typeof this.facets[facetName] === 'string') {
            let fieldValue = this.facets[facetName] ? this.facets[facetName] : 'all';
            listOfFacets.push({ key: `${facetName}:${fieldValue}`, facetName: facetName, fieldValue: fieldValue });
          }

          for (let fieldValue of this.facets[facetName]) {
            if (typeof this.facets[facetName] !== 'string') {
              listOfFacets.push({ key: `${facetName}:${fieldValue}`, facetName: facetName, fieldValue: fieldValue });
            }
          }
        }
        return listOfFacets;
      }
    }
  };
</script>
