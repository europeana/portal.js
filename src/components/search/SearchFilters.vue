<template>
  <div
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
        :escaped="true"
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
       * Object, keyed by filter name, with value(s) being selected fields for the
       * filter.
       *
       * @type {Object}
       */
      filters: {
        type: Object,
        required: true
      },

      /**
       * Whether to prefix selected filters with field label
       *
       * If `true`, prefix all. If a function, call it with the field name to test.
       */
      prefix: {
        type: [Boolean, Function],
        default: false
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
        if (!this.prefix) {
          return false;
        } else if (typeof this.prefix === 'function') {
          return this.prefix(filter.filterName);
        } else {
          return true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .filter-badges {
    display: flex;
    flex-wrap: wrap;
  }

  .filter-badge {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
