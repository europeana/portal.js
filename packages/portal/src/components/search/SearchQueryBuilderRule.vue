<template>
  <div
    class="d-flex align-items-center flex-wrap flex-lg-nowrap"
  >
    <b-input-group
      data-qa="search query builder rule"
      class="query-rule"
    >
      <template
        v-for="component in ruleComponents"
      >
        <b-form-group
          :key="`${id}-${component}`"
          class="query-rule-form-group mr-lg-2"
          :label-for="`${id}-${component}`"
        >
          <template #label>
            <span
              :id="`${id}-${component}-label`"
              class="d-inline-flex align-items-center"
            >
              {{ $t(`search.advanced.input.${component}`) }}
              <template v-if="tooltips">
                <b-button
                  :id="`${id}-${component}-tooltip-btn`"
                  class="icon-info-outline py-0 px-1 tooltip-button"
                  variant="light-flat"
                />
                <b-tooltip
                  :target="`${id}-${component}-tooltip-btn`"
                  :title="$t(`search.advanced.tooltip.${component}`)"
                  boundary-padding="0"
                  placement="bottom"
                />
              </template>
            </span>
          </template>
          <div
            :id="`${id}-${component}`"
          >
            <b-form-input
              v-if="component === 'term'"
              v-model="term"
              :placeholder="$t('search.advanced.placeholder.term')"
              :state="validations.term.state"
              @change="(value) => handleRuleChange('term', value)"
            />
            <b-dropdown
              v-else
              :text="dropdownText[component]"
              :state="validations[component].state"
              block
              no-flip
              class="search-query-builder-rule-dropdown search-filter-dropdown"
              :toggle-class="{ 'form-control': true, 'is-invalid': validations[component].state === false }"
            >
              <div
                v-for="(section, sectionIndex) in dropdownSections[component]"
                :key="`${component}-section-${sectionIndex}`"
              >
                <component
                  :is="Array.isArray(section.options) ? 'b-dropdown-group' : 'div'"
                  :header="section.header"
                >
                  <b-dropdown-item-button
                    v-for="(sectionOption, sectionOptionIndex) in [].concat(section.options)"
                    :key="`${component}-section-${sectionIndex}-options-${sectionOptionIndex}`"
                    @click="handleRuleChange(component, sectionOption.value)"
                  >
                    {{ sectionOption.text }}
                    <b-button
                      v-if="$te(`search.advanced.tooltip.${component}s.${sectionOption.value}`)"
                      v-b-tooltip.bottom
                      :title="$t(`search.advanced.tooltip.${component}s.${sectionOption.value}`)"
                      class="icon-info-outline p-0 tooltip-button"
                      variant="light-flat"
                    />
                  </b-dropdown-item-button>
                </component>
                <b-dropdown-divider
                  v-if="(sectionIndex + 1) < dropdownSections[component].length"
                />
              </div>
            </b-dropdown>
          </div>
          <b-form-invalid-feedback
            v-show="validate"
            :state="validations[component].state"
          >
            {{ validations[component].text }}
          </b-form-invalid-feedback>
        </b-form-group>
      </template>
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
  import AlertMessage from '../generic/AlertMessage';
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
        ruleComponents: ['field', 'modifier', 'term'],
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
      forEveryRuleComponent(callback) {
        for (const component of this.ruleComponents) {
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
        const noRuleComponentHasValue = ![this.term, this.field, this.modifier].some((value) => !!value);
        this.forEveryRuleComponent((component) => {
          if (noRuleComponentHasValue || this[component]) {
            this.validations[component] = { state: true };
          } else {
            this.validations[component] = { state: false, text: this.$t('statuses.required') };
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
