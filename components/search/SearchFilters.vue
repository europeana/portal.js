<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFilter in filterList"
      :key="selectedFilter.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <FacetFieldLabel
        :facet-name="selectedFilter.filterName"
        :field-value="selectedFilter.fieldValue"
        :prefixed="selectedFilter.filterName !== 'contentTier'"
      />
    </b-badge>
  </div>
</template>

<script>
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    name: 'SearchFilters',

    components: {
      FacetFieldLabel
    },

    props: {
      filters: {
        type: Object,
        default: () => {}
      }
    },

    computed: {
      filterList() {
        let listOfFilters = [];
        for (let filterName in this.filters) {
          if (typeof this.filters[filterName] === 'string') {
            let fieldValue = this.filters[filterName];
            if (fieldValue !== '') {
              listOfFilters.push({ key: `${filterName}:${fieldValue}`, filterName, fieldValue });
            }
          }

          for (let fieldValue of this.filters[filterName]) {
            if (typeof this.filters[filterName] !== 'string') {
              listOfFilters.push({ key: `${filterName}:${fieldValue}`, filterName, fieldValue });
            }
          }
        }

        return listOfFilters;
      }
    }
  };
</script>
