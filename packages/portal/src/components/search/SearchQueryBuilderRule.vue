<template>
  <!-- TODO: translate hardcoded texts -->
  <b-input-group>
    <b-form-group
      label-for="select-field"
    >
      <template #label>
        <span id="select-field-label">Field</span>
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
        <span id="select-modifier-label">Modifier</span>
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
      label="Enter search term(s)"
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
        default: () => [
          // TODO: translate text values
          // TODO: replace values with query syntax
          { value: null, text: 'Select one' },
          { value: 'a', text: 'Any field' },
          { value: 'b', text: 'Subject' },
          { value: 'c', text: 'Title' },
          { value: 'd', text: 'Description' },
          { value: 'e', text: 'Creator' },
          { value: 'f', text: 'Type' }
        ]
      },
      modifiers: {
        type: Array,
        default: () => [
          // TODO: translate text values
          // TODO: replace values with query syntax
          { value: null, text: 'Select one' },
          { value: 'a', text: 'contains' },
          { value: 'b', text: 'does not contain' },
          { value: 'c', text: 'is' },
          { value: 'd', text: 'is not' },
          { value: 'e', text: 'starts with' },
          { value: 'f', text: 'ends with' }
        ]
      }
    }
  };
</script>
