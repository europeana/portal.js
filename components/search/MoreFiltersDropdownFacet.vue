<template>
  <b-dropdown-form>
    <strong
      class="mb-3 d-inline-block"
    >
      {{ $tc(`facets.${name}.name`, 1) }}
    </strong>
    <b-form-checkbox-group
      v-model="selectedOptions"
      class="option-group"
      :name="$tc(`facets.${name}.name`, 1)"
      plain
      @change="selectedHandler"
    >
      <MoreFiltersDropdownFacetOption
        v-for="(filter, index) in fields.slice(0, limitTo)"
        :key="index"
        :facet-name="name"
        :option="filter.label"
        :index="index"
      />
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
    </b-form-checkbox-group>
    <button
      v-if="fields.length > limitTo"
      type="button"
      class="btn btn-link btn-toggle"
      :class="{ 'is-active': isActive }"
      :data-qa="(isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) + ' button' : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2) }) + ' button')"
      @click.prevent="isActive = !isActive"
    >
      {{ isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2).toLowerCase() }) }}
    </button>
  </b-dropdown-form>
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
