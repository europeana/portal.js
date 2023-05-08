<template>
  <!-- TODO: translate hardcoded texts -->
  <b-input-group>
    <b-form-group
      label="Field"
      label-for="select-field"
    >
      <b-form-select
        id="select-field"
        :value="selectedField"
        :options="searchFields"
        @input="(value) => $emit('change', 'selectedField', value)"
      />
    </b-form-group>
    <b-form-group
      label="Modifier"
      label-for="select-modifier"
    >
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
  export default {
    name: 'SearchQueryBuilderRule',

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
