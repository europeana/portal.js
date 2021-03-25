<template>
  <div
    v-if="filterList.length > 0"
    class="mb-3"
  >
    <b-badge
      v-for="(filter, index) in filterList"
      :key="index"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <FacetFieldLabel
        :facet-name="filter.filterName"
        :field-value="filter.fieldValue"
        :prefixed="filter.filterName !== 'contentTier'"
      />
    </b-badge>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    name: 'SearchFilters',

    components: {
      FacetFieldLabel
    },

    computed: {
      ...mapGetters({
        filters: 'search/filters'
      }),

      filterList() {
        const listOfFilters = [];

        for (const filterName in this.filters) {
          if (typeof this.filters[filterName] === 'string') {
            const fieldValue = this.filters[filterName];
            if (fieldValue !== '') {
              listOfFilters.push({ filterName, fieldValue });
            }
          } else {
            for (const fieldValue of this.filters[filterName]) {
              listOfFilters.push({ filterName, fieldValue });
            }
          }
        }

        return listOfFilters;
      }
    }
  };
</script>
