<template>
  <div
    class="d-flex align-items-center flex-wrap flex-lg-nowrap"
  >
    <b-input-group
      data-qa="search query builder rule"
      class="query-rule"
    >
      <template
        v-for="control in ruleControls"
      >
        <b-form-group
          :key="`${id}-${control}`"
          class="query-rule-form-group mr-lg-2"
        >
          <component
            :is="control === 'term' ? 'label' : 'span'"
            :id="`${id}-${control}-label`"
            class="query-rule-field-label d-inline-flex align-items-center"
            :for="`${id}-${control}`"
          >
            {{ $t(`search.advanced.input.${control}`) }}
            <template v-if="tooltips">
              <b-button
                :id="`${id}-${control}-tooltip-btn`"
                class="icon-info-outline py-0 px-1 tooltip-button"
                :aria-label="$t(`search.advanced.tooltip.${control}`)"
                variant="light-flat"
              />
              <b-tooltip
                :target="`${id}-${control}-tooltip-btn`"
                :title="$t(`search.advanced.tooltip.${control}`)"
                boundary-padding="0"
                placement="bottom"
              />
            </template>
          </component>
          <div>
            <SearchQueryBuilderRuleTermInput
              v-if="control === 'term'"
              :id="`${id}-${control}`"
              v-model="term"
              :data-qa="`advanced search query builder: ${control} control`"
              :placeholder="$t('search.advanced.placeholder.term')"
              :state="validations.term.state"
              @change="(value) => handleRuleChange('term', value)"
            />
            <SearchQueryBuilderRuleDropdown
              v-else
              :id="`${id}-${control}`"
              :name="control"
              :options="dropdownSections[control]"
              :state="validations[control].state"
              :text="dropdownText[control]"
              @change="(value) => handleRuleChange(control, value)"
            />
          </div>
          <b-form-invalid-feedback
            v-show="validate"
            :state="validations[control].state"
          >
            {{ validations[control].text }}
          </b-form-invalid-feedback>
        </b-form-group>
      </template>
    </b-input-group>
    <b-button
      data-qa="search query builder rule clear button"
      variant="light"
      class="d-inline-flex align-items-center ml-lg-1 mb-3 mb-lg-0"
      @click="clearRule"
    >
      <span class="icon-cancel-circle pr-1" />
      {{ $t('actions.clear') }}
    </b-button>
  </div>
</template>

<script>
  import SearchQueryBuilderRuleDropdown from './SearchQueryBuilderRuleDropdown';
  import SearchQueryBuilderRuleTermInput from './SearchQueryBuilderRuleTermInput';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

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
      id: {
        type: String,
        default: 'search-query-builder-rule'
      },
      tooltips: {
        type: Boolean,
        default: true
      },
      validate: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        aggregatedFieldNames: ['who', 'where', 'when', 'what'],
        field: null,
        fulltextFieldName: 'fulltext',
        modifier: null,
        ruleControls: ['field', 'modifier', 'term'],
        term: null,
        validations: {
          field: { state: null },
          modifier: { state: null },
          term: { state: null }
        }
      };
    },

    computed: {
      aggregatedFieldOptions() {
        return this.fieldOptions
          .filter((field) => this.aggregatedFieldNames.includes(field.value));
      },
      dropdownSections() {
        return {
          field: [
            { options: this.fulltextFieldOption },
            { header: this.$t('search.advanced.header.aggregated'), options: this.aggregatedFieldOptions },
            { header: this.$t('search.advanced.header.individual'), options: this.individualFieldOptions }
          ],
          modifier: [
            {
              options: this.advancedSearchModifiers.map((mod) => ({
                value: mod.name,
                text: this.$t(`search.advanced.modifiers.${mod.name}`)
              }))
            }
          ]
        };
      },
      dropdownText() {
        return {
          field: this.field ? this.advancedSearchFieldLabel(this.field) : this.$t('search.advanced.placeholder.field'),
          modifier: this.modifier ? this.$t(`search.advanced.modifiers.${this.modifier}`) : this.$t('search.advanced.placeholder.modifier')
        };
      },
      fieldOptions() {
        return this.advancedSearchFields.map((field) => ({
          value: field.name,
          text: this.advancedSearchFieldLabel(field.name)
        }))
          .sort((a, b) => a.text.localeCompare(b.text));
      },
      fulltextFieldOption() {
        return this.fieldOptions.find((field) => field.value === this.fulltextFieldName);
      },
      individualFieldOptions() {
        return this.fieldOptions
          .filter((field) => !this.aggregatedFieldNames.includes(field.value) && (field.value !== this.fulltextFieldName));
      }
    },

    watch: {
      value: {
        deep: true,
        handler() {
          this.initData();
        }
      },
      validate: {
        deep: true,
        handler: 'validateRules'
      }
    },

    created() {
      this.initData();
    },

    methods: {
      clearRule() {
        this.$emit('clear');
      },
      forEveryRuleControl(callback) {
        for (const control of this.ruleControls) {
          callback(control);
        }
      },
      handleRuleChange(key, value) {
        this[key] = value;
        this.$emit('change', key, value);
      },
      initData() {
        this.forEveryRuleControl((control) => {
          this[control] = this.value[control] || null;
        });
      },
      validateRules() {
        // If any rule control has a value, all are required. If none have a value, the
        // rule will be ignored and none are required.
        const noRuleControlHasValue = ![this.term, this.field, this.modifier].some((value) => !!value);
        this.forEveryRuleControl((control) => {
          if (noRuleControlHasValue || this[control]) {
            this.validations[control] = { state: true };
          } else {
            this.validations[control] = { state: false, text: this.$t('statuses.required') };
          }
        });
        this.$emit(Object.values(this.validations).some((validation) => !validation.state) ? 'invalid' : 'valid');
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

    &.is-invalid,
    &.is-valid {
      background-image: none;
      padding-right: 0.75rem !important;
    }

    &.is-invalid {
      border-color: $red;
    }
  }
</style>
