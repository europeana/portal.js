<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFacet in facetList"
      :key="selectedFacet.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      {{ $t('formatting.labelledValue', { label: $t(`facets.${selectedFacet.facetName}`), value: selectedFacet.fieldValue}) }}
    </b-badge>
  </div>
</template>

<script>

  import { thematicCollections } from '../../plugins/europeana/search';

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
            const value = this.facets[facetName];
            let fieldValue = this.facets[facetName];
            if (facetName === 'THEME') {
              const [field] = thematicCollections.filter(obj => {
                return obj.value === value;
              });
              fieldValue = field.label;
            }
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
