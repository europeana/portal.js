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
                class="icon-info-outline py-0 px-1 tooltip-button"
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
        <div
          :id="`select-field-${id}`"
        >
          <b-dropdown
            :text="fieldDropdownText"
            block
            no-flip
            class="search-query-builder-field-dropdown search-filter-dropdown"
          >
            <div
              v-for="(fieldSection, sectionIndex) in fieldDropdownSections"
              :key="`section-${sectionIndex}`"
            >
              <component
                :is="Array.isArray(fieldSection.fields) ? 'b-dropdown-group' : 'div'"
                :header="fieldSection.header"
              >
                <b-dropdown-item-button
                  v-for="(fieldOption, fieldIndex) in [].concat(fieldSection.fields)"
                  :key="`field-${fieldIndex}`"
                  @click="handleRuleChange('field', fieldOption.value)"
                >
                  {{ fieldOption.text }}
                  <b-button
                    v-if="$te(`search.advanced.tooltip.fields.${fieldOption.value}`)"
                    v-b-tooltip.bottom
                    :title="$t(`search.advanced.tooltip.fields.${fieldOption.value}`)"
                    class="icon-info-outline p-0 tooltip-button"
                    variant="light-flat"
                  />
                </b-dropdown-item-button>
              </component>
              <b-dropdown-divider
                v-if="(sectionIndex + 1) < fieldDropdownSections.length"
              />
            </div>
          </b-dropdown>
        </div>
        <b-form-invalid-feedback
          v-show="validate"
          :state="validations.field.state"
        >
          {{ validations.field.text }}
        </b-form-invalid-feedback>
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
                class="icon-info-outline py-0 px-1 tooltip-button"
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
          v-model="modifier"
          :options="selectModifierOptions"
          @change="(value) => handleRuleChange('modifier', value)"
        />
        <b-form-invalid-feedback
          v-show="validate"
          :state="validations.modifier.state"
        >
          {{ validations.modifier.text }}
        </b-form-invalid-feedback>
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
                class="icon-info-outline py-0 px-1 tooltip-button"
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
          v-model="term"
          :placeholder="$t('search.advanced.placeholder.searchTerm')"
          @change="(value) => handleRuleChange('term', value)"
        />
        <b-form-invalid-feedback
          v-show="validate"
          :state="validations.term.state"
        >
          {{ validations.term.text }}
        </b-form-invalid-feedback>
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
  import AlertMessage from '../generic/AlertMessage'
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      AlertMessage,
      BFormSelect
    },

    mixins: [
      advancedSearchMixin
    ],

    props: {
      id: {
        type: String,
        default: null
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
        term: null,
        validations: {
          field: { state: true },
          modifier: { state: true },
          term: { state: true }
        }
      };
    },

    computed: {
      aggregatedFieldOptions() {
        return this.fieldOptions
          .filter((field) => this.aggregatedFieldNames.includes(field.value));
      },
      fieldDropdownSections() {
        return [
          { fields: this.fulltextFieldOption },
          { fields: this.aggregatedFieldOptions, header: this.$t('search.advanced.header.aggregated') },
          { fields: this.individualFieldOptions, header: this.$t('search.advanced.header.individual') }
        ];
      },
      fieldDropdownText() {
        return this.field ? this.advancedSearchFieldLabel(this.field) : this.$t('search.advanced.placeholder.field');
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
      },
      selectModifierOptions() {
        return [{ value: null,
                  text: this.$t('search.advanced.placeholder.modifier') }]
          .concat(
            this.advancedSearchModifiers.map((mod) => ({
              value: mod.name,
              text: this.$t(`search.advanced.modifiers.${mod.name}`)
            })));
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
        handler: this.validateRules
      }
    },

    created() {
      this.initData();
    },

    methods: {
      clearRule() {
        this.$emit('clear');
      },
      forEveryRuleComponent(callback) {
        for (const component of ['field', 'modifier', 'term']) {
          callback(component);
        }
      },
      handleRuleChange(key, value) {
        this[key] = value;
        this.$emit('change', key, value);
      },
      initData() {
        this.forEveryRuleComponent((component) => {
          this[component] = this.value[component] || null;
        });
      },
      validateRules() {
        // If any rule component has a value, all are required. If none have a value, the
        // rule will be ignored and none are required.
        if ([this.term, this.field, this.modifier].some((value) => !!value)) {
          this.forEveryRuleComponent((component) => {
            if (this[component]) {
              this.validations[component] = { state: true };
            } else {
              this.validations[component] = { state: false, text: this.$t('set.form.required') };
            }
          });
        }
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
  }
</style>
