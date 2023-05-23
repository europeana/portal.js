<template>
  <div
    class="d-flex align-items-center"
  >
    <b-input-group
      data-qa="search query builder rule"
    >
      <b-form-group
        :label-for="`select-field-${id}`"
      >
        <template #label>
          <span :id="`select-field-label-${id}`">
            {{ $t('search.advanced.input.field') }}
          </span>
        </template>
        <b-tooltip
          :target="`select-field-label-${id}`"
          :title="$t('search.advanced.tooltip.field')"
          boundary-padding="0"
          placement="bottom"
        />
        <b-form-select
          :id="`select-field-${id}`"
          v-model="selectField"
          :options="selectFieldOptions"
          :required="areAllRequired"
          @input="(value) => handleFieldInput(value)"
        />
      </b-form-group>
      <b-form-group
        :label-for="`select-modifier-${id}`"
      >
        <template #label>
          <span :id="`select-modifier-label-${id}`">
            {{ $t('search.advanced.input.modifier') }}
          </span>
        </template>
        <b-tooltip
          :target="`select-modifier-label-${id}`"
          :title="$t('search.advanced.tooltip.modifier')"
          boundary-padding="0"
          placement="bottom"
        />
        <b-form-select
          :id="`select-modifier-${id}`"
          v-model="selectModifier"
          :options="selectModifierOptions"
          :required="areAllRequired"
          @input="(value) => handleModifierInput(value)"
        />
      </b-form-group>
      <b-form-group
        :label="$t('search.advanced.input.searchTerm')"
        :label-for="`search-term-${id}`"
      >
        <b-form-input
          :id="`search-term-${id}`"
          v-model="inputTerm"
          :required="areAllRequired"
          @input="(value) => handleTermInput(value)"
        />
      </b-form-group>
    </b-input-group>
    <b-button
      @click="clearRule"
    >
      {{ $t('search.advanced.actions.clear') }}
    </b-button>
  </div>
</template>

<script>
  import { BFormSelect, BTooltip } from 'bootstrap-vue';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      BFormSelect,
      BTooltip
    },

    mixins: [
      advancedSearchMixin
    ],

    props: {
      field: {
        type: String,
        default: null
      },
      modifier: {
        type: String,
        default: null
      },
      term: {
        type: String,
        default: null
      },
      id: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        inputTerm: this.term,
        selectField: this.field,
        selectModifier: this.modifier
      };
    },

    computed: {
      // If any field has a value, all are required. If none have a value, the
      // rule will be ignored and none are required.
      areAllRequired() {
        return [this.inputTerm, this.selectField, this.selectModifier].some((value) => (
          value !== null && value !== ''
        ));
      },
      selectFieldOptions() {
        return this.advancedSearchFields.map((field) => ({
          value: field.name,
          text: this.advancedSearchFieldLabel(field)
        }))
          .sort((a, b) => a.text.localeCompare(b.text));
      },
      selectModifierOptions() {
        return this.advancedSearchModifiers.map((mod) => ({
          value: mod.name,
          text: this.$i18n.t(`search.advanced.modifiers.${mod.name}`)
        }));
      }
    },

    methods: {
      clearRule() {
        this.inputTerm = null;
        this.selectField = null;
        this.selectModifier = null;
        this.$emit('clear');
      },
      handleTermInput(value) {
        this.$emit('change', 'term', value);
      },
      handleFieldInput(value) {
        this.$emit('change', 'field', value);
      },
      handleModifierInput(value) {
        this.$emit('change', 'modifier', value);
      }
    }
  };
</script>
