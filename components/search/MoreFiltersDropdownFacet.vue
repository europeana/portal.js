<template>
  <b-form-group
    :label="$tc(`facets.${name}.name`, 1)"
    :data-qa="`${name} facet`"
    class="more-facets-wrapper"
  >
    <b-form-checkbox-group
      v-model="selectedOptions"
      :name="$tc(`facets.${name}.name`, 1)"
      plain
      @change="selectedHandler"
    >
      <div
        class="option-group"
      >
        <MoreFiltersDropdownFacetOption
          v-for="(filter, index) in fields.slice(0, limitTo)"
          :key="index"
          :facet-name="name"
          :option="filter.label"
          :index="index"
        />
      </div>
      <div
        v-if="fields.length > limitTo && isActive"
        class="option-group"
      >
        <MoreFiltersDropdownFacetOption
          v-for="(filter, index) in fields.slice(limitTo)"
          :key="index"
          :facet-name="name"
          :option="filter.label"
          :index="index + limitTo"
        />
      </div>
      <button
        v-if="fields.length > limitTo"
        type="button"
        class="btn btn-link btn-toggle"
        :class="{ 'is-active': isActive }"
        :data-qa="`${showMoreOrLess} button`"
        @click.prevent="isActive = !isActive"
      >
        {{ showMoreOrLess }}
      </button>
    </b-form-checkbox-group>
  </b-form-group>
</template>

<script>
  import MoreFiltersDropdownFacetOption from './MoreFiltersDropdownFacetOption';

  export default {
    components: {
      MoreFiltersDropdownFacetOption
    },

    props: {
      fields: {
        type: Array,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      selected: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        selectedOptions: this.selected,
        isActive: false,
        limitTo: 9
      };
    },

    computed: {
      showMoreOrLess() {
        const key = this.isActive ? 'facets.button.showLess' : 'facets.button.showAll';
        return this.$t(key, { label: this.$tc(`facets.${this.name}.name`, 2).toLowerCase() });
      }
    },

    watch: {
      selected(value) {
        this.selectedOptions = value;
      }
    },

    methods: {
      selectedHandler(value) {
        this.$emit('selectedOptions', this.name, value);
      }
    }
  };
</script>
