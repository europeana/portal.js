<template>
  <div
    class="d-flex align-items-center flex-wrap flex-lg-nowrap"
  >
    <b-input-group
      data-qa="search query builder rule"
      class="query-rule"
    >
      <b-form-group
        class="query-rule-form-group mr-lg-2"
        :label-for="`select-field-${id}`"
      >
        <template #label>
          <span
            :id="`select-field-label-${id}`"
            class="d-inline-flex align-items-center"
          >
            {{ $t('search.advanced.input.field') }}
            <template v-if="tooltips">
              <b-button
                :id="`select-field-tooltip-btn-${id}`"
                class="icon-info py-0 px-1 tooltip-button"
                variant="light-flat"
              />
              <b-tooltip
                :target="`select-field-tooltip-btn-${id}`"
                :title="$t('search.advanced.tooltip.field')"
                boundary-padding="0"
                placement="bottom"
              />
            </template>
          </span>
        </template>
        <b-form-select
          :id="`select-field-${id}`"
          v-model="selectField"
          :options="selectFieldOptions"
          :required="areAllRequired"
          @change="(value) => handleFieldChange(value)"
        />
      </b-form-group>
      <b-form-group
        class="query-rule-form-group mr-lg-2"
        :label-for="`select-modifier-${id}`"
      >
        <template #label>
          <span
            :id="`select-modifier-label-${id}`"
            class="d-inline-flex align-items-center"
          >
            {{ $t('search.advanced.input.modifier') }}
            <template v-if="tooltips">
              <b-button
                :id="`select-modifier-tooltip-btn-${id}`"
                class="icon-info py-0 px-1 tooltip-button"
                variant="light-flat"
              />
              <b-tooltip
                :target="`select-modifier-tooltip-btn-${id}`"
                :title="$t('search.advanced.tooltip.modifier')"
                boundary-padding="0"
                placement="bottom"
              />
            </template>
          </span>
        </template>
        <b-form-select
          :id="`select-modifier-${id}`"
          v-model="selectModifier"
          :options="selectModifierOptions"
          :required="areAllRequired"
          @change="(value) => handleModifierChange(value)"
        />
      </b-form-group>
      <b-form-group
        class="query-rule-form-group"
        :label-for="`search-term-${id}`"
      >
        <template #label>
          <span
            :id="`search-term-label-${id}`"
            class="d-inline-flex align-items-center"
          >
            {{ $t('search.advanced.input.searchTerm') }}
            <template v-if="tooltips">
              <b-button
                :id="`search-term-tooltip-btn-${id}`"
                class="icon-info py-0 px-1 tooltip-button"
                variant="light-flat"
              />
              <b-tooltip
                :target="`search-term-tooltip-btn-${id}`"
                :title="$t('search.advanced.tooltip.term')"
                boundary-padding="0"
                placement="bottom"
              />
            </template>
          </span>
        </template>
        <b-form-input
          :id="`search-term-${id}`"
          v-model="inputTerm"
          :required="areAllRequired"
          @change="(value) => handleTermChange(value)"
        />
      </b-form-group>
    </b-input-group>
    <b-button
      data-qa="search query builder rule clear button"
      variant="light"
      class="d-inline-flex align-items-center ml-auto ml-lg-1"
      @click="clearRule"
    >
      <span class="icon-cancel-circle pr-1" />
      {{ $t('actions.clear') }}
    </b-button>
  </div>
</template>

<script>
  import { BFormSelect } from 'bootstrap-vue';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      BFormSelect
    },

    mixins: [
      advancedSearchMixin
    ],

    props: {
      field: {
        type: String,
        default: null
      },
      id: {
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
      tooltips: {
        type: Boolean,
        default: true
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
          text: this.$t(`search.advanced.modifiers.${mod.name}`)
        }));
      }
    },

    watch: {
      field(newVal) {
        this.selectField = newVal;
      },
      modifier(newVal) {
        this.selectModifier = newVal;
      },
      term(newVal) {
        this.inputTerm = newVal;
      }
    },

    methods: {
      clearRule() {
        this.$emit('clear');
      },
      handleTermChange(value) {
        this.$emit('change', 'term', value);
      },
      handleFieldChange(value) {
        this.$emit('change', 'field', value);
      },
      handleModifierChange(value) {
        this.$emit('change', 'modifier', value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .query-rule {
    max-width: $max-text-column-width;

    @media (min-width: $bp-large) {
      flex-wrap: nowrap;
    }

    @media (min-width: $bp-wqhd) {
      max-width: 50%;
    }
  }

  .query-rule-form-group {
    flex-basis: 100%;

    @media (min-width: $bp-large) {
      flex-basis: calc(33%);
    }

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        margin-right: 0.75rem !important;
      }
    }
  }

  .form-control {
    background-color: $white;
    border: 1px solid $middlegrey;
    border-radius: 0.375rem;
    font-weight: normal;
    height: 3rem;
    color: $greyblack;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
        height: 4.5rem;
        padding: calc(1.5 * 0.375rem) calc(1.5 * 0.75rem);
      }
    }

    &:focus {
      border-color: $blue;
    }
  }
</style>
