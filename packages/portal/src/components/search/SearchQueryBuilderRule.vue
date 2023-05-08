<template>
  <b-input-group>
    <b-form-group
      label-for="select-field"
    >
      <template #label>
        <span id="select-field-label">
          {{ $t('search.advanced.input.field') }}
        </span>
      </template>
      <b-tooltip
        target="select-field-label"
        :title="$t('search.advanced.tooltip.field')"
        boundary-padding="0"
        placement="bottom"
      />
      <b-form-select
        id="select-field"
        :value="selectedField"
        :options="searchFields"
        @input="(value) => $emit('change', 'selectedField', value)"
      />
    </b-form-group>
    <b-form-group
      label-for="select-modifier"
    >
      <template #label>
        <span id="select-modifier-label">
          {{ $t('search.advanced.input.modifier') }}
        </span>
      </template>
      <b-tooltip
        target="select-modifier-label"
        :title="$t('search.advanced.tooltip.modifier')"
        boundary-padding="0"
        placement="bottom"
      />
      <b-form-select
        id="select-modifier"
        :value="selectedModifier"
        :options="modifiers"
        @input="(value) => $emit('change', 'selectedModifier', value)"
      />
    </b-form-group>
    <b-form-group
      :label="$t('search.advanced.input.searchTerm')"
      label-for="search-term"
    >
      <b-form-input
        id="search-term"
        :value="searchTerm"
        @input="(value) => $emit('change', 'searchTerm', value)"
      />
    </b-form-group>
  </b-input-group>
</template>

<script>
  import { BFormSelect, BTooltip } from 'bootstrap-vue';
  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      BFormSelect,
      BTooltip
    },
    props: {
      searchTerm: {
        type: String,
        default: null
      },
      selectedField: {
        type: String,
        default: null
      },
      selectedModifier: {
        type: String,
        default: null
      },
      searchFields: {
        type: Array,
        default: () => []
      },
      modifiers: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
