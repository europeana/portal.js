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
        @input="(value) => handleFieldInput(value)"
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
        :options="availableModifiers"
        @input="(value) => handleModifierInput(value)"
      />
    </b-form-group>
    <b-form-group
      :label="$t('search.advanced.input.searchTerm')"
      label-for="search-term"
    >
      <b-form-input
        id="search-term"
        :value="searchTerm"
        @input="(value) => handleTermInput(value)"
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
    data() {
      return {
        searchFields: [
          { value: 'anyField', text: this.$t('search.advanced.fields.anyField') },
          { value: 'subject', text: this.$t('search.advanced.fields.subject') },
          { value: 'title', text: this.$t('search.advanced.fields.title') },
          { value: 'description', text: this.$t('search.advanced.fields.description') },
          { value: 'creator', text: this.$t('search.advanced.fields.creator') },
          { value: 'type', text: this.$t('search.advanced.fields.type') }
        ],
        modifiers: [
          { value: 'contains', text: this.$t('search.advanced.modifiers.contains') },
          { value: 'doesNotContain', text: this.$t('search.advanced.modifiers.notContain') },
          { value: 'is', text: this.$t('search.advanced.modifiers.is') },
          { value: 'isNot', text: this.$t('search.advanced.modifiers.isNot') },
          { value: 'startsWith', text: this.$t('search.advanced.modifiers.startsWith') },
          { value: 'endsWith', text: this.$t('search.advanced.modifiers.endsWith') }
        ]
      };
    },
    props: {
      rule: {
        type: Object,
        default:() => ({})
      }
    },
    computed: {
      searchTerm() {
        return this.rule.searchTerm;
      },
      selectedField() {
        return this.rule.selectedField;
      },
      selectedModifier()  {
        return this.rule.selectedModifier;
      },
      availableModifiers() {
        return this.selectedField == 'anyField' ? [this.modifiers.find((mod) => mod.value === 'is')] : this.modifiers;
      }
    },
    methods: {
      handleTermInput(value) {
        this.$emit('change', 'searchTerm', value);
      },
      handleFieldInput(value) {
        this.$emit('change', 'selectedField', value);
      },
      handleModifierInput(value) {
        this.$emit('change', 'selectedModifier', value);
      }
    }
  };
</script>
