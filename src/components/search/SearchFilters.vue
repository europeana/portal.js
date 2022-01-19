<template>
  <div
    v-if="filterList.length > 0"
    class="filter-badges"
  >
    <b-badge
      v-for="(filter, index) in filterList"
      :key="index"
      variant="secondary"
      class="mr-2 mb-2 filter-badge"
      data-qa="filter badge"
    >
      <FacetFieldLabel
        :facet-name="filter.filterName"
        :field-value="filter.fieldValue"
        :prefixed="prefixed(filter)"
        :truncate="truncateLabels"
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
      /**
       * Selected filter(s)
       *
       * Object, keyed by filter name, with values being selected fields for the
       * filter.
       *
       * @type {Object}
       */
      filters: {
        type: Object,
        required: true
      },

      /**
       * Truncate labels to this length, if > -1
       *
       * @type {Number}
       */
      truncateLabels: {
        type: Number,
        default: -1
      }
    },

    computed: {
      filterList() {
        const filterList = [];

        for (const filterName in this.filters) {
          for (const fieldValue of [].concat(this.filters[filterName])) {
            filterList.push({
              filterName,
              fieldValue
            });
          }
        }

        return filterList;
      }
    },

    methods: {
      prefixed(filter) {
        return this.$features.sideFilters ? false : (filter.filterName !== 'contentTier');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .filter-badges {
    display: flex;
    flex-wrap: wrap;
  }
</style>
