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
        <b-dropdown
          :text="fieldDropdownText"
          block
          no-flip
        >
          <b-dropdown-item-button
            @click="handleFieldChange(fulltextFieldName)"
          >
            <span>{{ advancedSearchFieldLabel(fulltextFieldName) }}</span>
            <b-button
              v-b-tooltip.bottom
              title="Full-text includes transcriptions, closed captions, subtitles and document text."
              class="icon-info-outline p-0 tooltip-button"
              variant="light-flat"
            />
          </b-dropdown-item-button>
          <b-dropdown-divider />
          <b-dropdown-group header="Aggregated fields">
            <b-dropdown-item-button
              v-for="(fieldOption, index) in aggregatedFieldOptions"
              :key="index"
              @click="handleFieldChange(fieldOption.value)"
            >
              {{ fieldOption.text }}
            </b-dropdown-item-button>
          </b-dropdown-group>
          <b-dropdown-divider />
          <b-dropdown-group header="Individual fields">
            <b-dropdown-item-button
              v-for="(fieldOption, index) in individualFieldOptions"
              :key="index"
              @click="handleFieldChange(fieldOption.value)"
            >
              {{ fieldOption.text }}
            </b-dropdown-item-button>
          </b-dropdown-group>
        </b-dropdown>
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
      id: {
        type: String,
        default: null
      },
      tooltips: {
        type: Boolean,
        default: true
      },
      value: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        field: null,
        modifier: null,
        term: null,
        fulltextFieldName: 'fulltext',
        aggregatedFieldNames: ['who', 'where', 'when', 'what']
      };
    },

    computed: {
      // If any field has a value, all are required. If none have a value, the
      // rule will be ignored and none are required.
      areAllRequired() {
        return [this.value.term, this.value.field, this.value.modifier].some((value) => !!value);
      },
      aggregatedFieldOptions() {
        return this.advancedSearchFields
          .filter((field) => this.aggregatedFieldNames.includes(field.name))
          .map((field) => ({
            value: field.name,
            text: this.advancedSearchFieldLabel(field.name)
          }))
          .sort((a, b) => a.text.localeCompare(b.text));
      },
      fieldDropdownText() {
        return this.field ? this.advancedSearchFieldLabel(this.field) : 'Select a field';
      },
      individualFieldOptions() {
        return this.advancedSearchFields
          .filter((field) => !this.aggregatedFieldNames.includes(field.name) && (field.name !== this.fulltextFieldName))
          .map((field) => ({
            value: field.name,
            text: this.advancedSearchFieldLabel(field.name)
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
      value: {
        deep: true,
        handler() {
          this.initData();
        }
      }
    },

    created() {
      this.initData();
    },

    methods: {
      initData() {
        this.field = this.value.field;
        this.modifier = this.value.modifier;
        this.term = this.value.term;
      },
      clearRule() {
        this.$emit('clear');
      },
      handleTermChange(value) {
        this.$emit('change', 'term', value);
      },
      handleFieldChange(value) {
        this.field = value;
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
