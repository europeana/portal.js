<template>
  <b-form-group
    :label="$tc(`facets.${name}.name`, 1)"
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
        :data-qa="(isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) + ' button' : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2) }) + ' button')"
        @click.prevent="isActive = !isActive"
      >
        {{ isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2) }) }}
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
