<template>
  <div
    class="d-flex align-items-center flex-wrap flex-lg-nowrap"
  >
    <b-form-group
      data-qa="search query builder rule"
      class="query-rule mb-0"
    >
      <template
        v-for="control in ruleControls"
      >
        <div
          :key="`${id}-${control}`"
          class="query-rule-form-control mr-lg-2 mb-3"
        >
          <component
            :is="control === 'term' ? 'label' : 'span'"
            :id="`${id}-${control}-label`"
            class="query-rule-field-label d-inline-flex align-items-center"
            :for="`${id}-${control}`"
          >
            <span
              class="align-self-center"
            >
              {{ $t(`search.advanced.input.${control}`) }}
            </span>
          </component>
          <template v-if="tooltips">
            <b-button
              :id="`${id}-${control}-tooltip-btn`"
              class="icon-info-outline py-0 px-1 tooltip-button align-self-center"
              :aria-label="$t(`search.advanced.tooltip.${control}`)"
              variant="light-flat"
            />
            <b-tooltip
              class="align-self-center"
              :target="`${id}-${control}-tooltip-btn`"
              :title="$t(`search.advanced.tooltip.${control}`)"
              boundary-padding="0"
              placement="bottom"
            />
          </template>
          <SearchQueryBuilderRuleTermInput
            v-if="control === 'term'"
            :id="`${id}-${control}`"
            v-model="rule[control]"
            :placeholder="$t('search.advanced.placeholder.term')"
            :state="validation[control]?.state"
            :suggest-entity-type="suggestEntityTypeForTerm"
            :advanced-search-field="value.field"
            @change="handleChange"
          />
          <SearchQueryBuilderRuleDropdown
            v-else
            :id="`${id}-${control}`"
            v-model="rule[control]"
            :name="control"
            :options="dropdownSections[control]"
            :state="validation[control]?.state"
            @change="handleChange"
          />

          <b-form-invalid-feedback
            v-show="!validation[control]?.state"
            :state="validation[control]?.state"
          >
            {{ validation[control]?.text }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </b-form-group>
    <b-button
      data-qa="search query builder rule clear button"
      variant="light"
      class="d-inline-flex align-items-center ml-lg-1 mb-3 mb-lg-0 mt-lg-2"
      @click="clearRule"
    >
      <span class="icon-clear pr-2" />
      {{ $t('actions.clear') }}
    </b-button>
  </div>
</template>

<script>
  import SearchQueryBuilderRuleDropdown from './SearchQueryBuilderRuleDropdown';
  import SearchQueryBuilderRuleTermInput from './SearchQueryBuilderRuleTermInput';
  import advancedSearchMixin, { FIELD_TYPE_FULLTEXT } from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      SearchQueryBuilderRuleDropdown,
      SearchQueryBuilderRuleTermInput
    },

    mixins: [
      advancedSearchMixin
    ],

    props: {
      /**
       * Id to set a unique value for each rule
       */
      id: {
        type: String,
        default: 'search-query-builder-rule'
      },
      /**
       * If `true`, shows tooltips beside the input labels
       */
      tooltips: {
        type: Boolean,
        default: true
      },
      /**
       * For each rule control, holds a `state` boolean and `text` msg if invalid
       */
      validation: {
        type: Object,
        default: () => ({})
      },
      /**
       * Value of the rule
       */
      value: {
        type: Object,
        default: () => ({
          field: null,
          modifier: null,
          term: null
        })
      }
    },

    data() {
      return {
        rule: this.value
      };
    },

    computed: {
      aggregatedFields() {
        return this.advancedSearchFields.filter((field) => field.aggregated);
      },
      dropdownSections() {
        return {
          field: [
            { options: this.fieldOption(this.fulltextField) },
            { header: this.$t('search.advanced.header.aggregated'), options: this.fieldOptionGroup(this.aggregatedFields) },
            { header: this.$t('search.advanced.header.individual'), options: this.fieldOptionGroup(this.individualFields) }
          ],
          modifier: [
            { options: this.modifierOptions }
          ]
        };
      },
      fieldOptions() {
        return this.advancedSearchFields.map((field) => ({
          text: this.advancedSearchFieldLabel(field.name),
          value: field.name
        }))
          .sort((a, b) => a.text.localeCompare(b.text));
      },
      fulltextField() {
        return this.advancedSearchFields.find((field) => field.type === FIELD_TYPE_FULLTEXT);
      },
      individualFields() {
        return this.advancedSearchFields
          .filter((field) => !this.aggregatedFields.concat(this.fulltextField).includes(field));
      },
      modifierOptions() {
        const modifiers = this.rule.field ?
          this.advancedSearchModifiersForField(this.rule.field) :
          this.advancedSearchModifiersForAllFields;

        return modifiers.map((mod) => ({
          text: this.$t(`search.advanced.modifiers.${mod.name}`),
          value: mod.name
        }));
      },
      ruleControls() {
        return Object.keys(this.rule);
      },
      suggestEntityTypeForTerm() {
        return this.advancedSearchFields.find((field) => field.name === this.rule.field)?.suggestEntityType;
      }
    },

    watch: {
      value() {
        this.rule = this.value;
      }
    },

    methods: {
      clearRule() {
        this.$emit('input', {
          field: null,
          modifier: null,
          term: null
        });
        this.$emit('clear');
      },
      fieldOptionGroup(fields) {
        return fields.map(this.fieldOption).sort((a, b) => a.text.localeCompare(b.text));
      },
      fieldOption(field) {
        return {
          text: this.advancedSearchFieldLabel(field.name),
          value: field.name
        };
      },
      forEveryRuleControl(callback) {
        for (const control of this.ruleControls) {
          callback(control);
        }
      },
      handleChange() {
        this.$emit('change', this.rule);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .query-rule {
    width: 100%;
    max-width: $max-text-column-width;

    @media (min-width: $bp-wqhd) {
      max-width: 50%;
    }

    ::v-deep > div {
      display: flex;
      align-items: stretch;
      flex-wrap: wrap;

      @media (min-width: $bp-large) {
        flex-wrap: nowrap;
      }
    }
  }

  .query-rule-form-control {
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

  .icon-clear {
    line-height: 1.2;
  }
</style>

<docs lang="md">
  Blank rule:
  ```jsx
    <SearchQueryBuilderRule />
  ```

  Rule with invalid modifier control, indicated via `validation`:
  ```jsx
    <SearchQueryBuilderRule
      :v-model="{ field: 'title', modifier: null, term: 'forest' }"
      :validation="{ field: { state: true }, modifier: { state: false, text: 'Required' }, term: { state: true } }"
    />
  ```
</docs>
