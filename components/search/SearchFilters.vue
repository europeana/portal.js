<template>
  <div class="mt-3">
    <b-badge
      v-for="selectedFilter in filterList"
      :key="selectedFilter.key"
      variant="secondary"
      class="mr-2"
      data-qa="filter badge"
    >
      <!-- TODO: move these if/else-if/else elements into a `badgeLabel` computed method -->
      <template v-if="selectedFilter.filterName === 'contentTier' && selectedFilter.fieldValue === '*'">
        {{ $t(`facets.${selectedFilter.filterName}.name`) }}
      </template>
      <template v-else-if="$te(`facets.${selectedFilter.filterName}.options.${selectedFilter.fieldValue}`)">
        {{ $t('formatting.labelledValue', { label: $tc(`facets.${selectedFilter.filterName}.name`, 1), value: $t(`facets.${selectedFilter.filterName}.options.${selectedFilter.fieldValue}`)}) }}
      </template>
      <template v-else>
        {{ $t('formatting.labelledValue', { label: $tc(`facets.${selectedFilter.filterName}.name`, 1), value: selectedFilter.fieldValue}) }}
      </template>
    </b-badge>
  </div>
</template>

<script>
  export default {
    name: 'SearchFilters',

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
