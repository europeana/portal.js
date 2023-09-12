<template>
  <div
    ref="searchdropdown"
    class="input-wrapper"
    :class="{ 'open': showSearchOptions }"
    @keydown="handleKeyDown"
  >
    <b-form-input
      :id="id"
      ref="searchinput"
      v-model="term"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      role="searchbox"
      aria-autocomplete="list"
      :aria-owns="showSearchOptions ? optionsId : null"
      :aria-expanded="showSearchOptions"
      :aria-controls="showSearchOptions ? optionsId : null"
      @input="showSearchOptions = true"
      @keydown.enter="handleChange"
    />
    <SearchQueryOptions
      v-show="showSearchOptions"
      :id="optionsId"
      ref="searchoptions"
      class="auto-suggest-dropdown"
      :text="term"
      :type="suggestEntityType"
      :suggest="!!suggestEntityType"
      :advanced-search="true"
      :advanced-search-field="advancedSearchField"
      :submitting="submitting"
      @select="(option) => handleSelect(option)"
    />
  </div>
</template>

<script>
  import SearchQueryOptions from './SearchQueryOptions';
  import searchOptionsKeyboardNav from '@/mixins/searchOptionsKeyboardNav';

  export default {
    name: 'SearchQueryBuilderRuleTermInput',

    components: {
      SearchQueryOptions
    },

    mixins: [searchOptionsKeyboardNav],

    props: {
      /**
       * Id to set a unique value for each term input
       */
      id: {
        type: String,
        default: null
      },
      /**
       * Name of the term input
       */
      name: {
        type: String,
        default: 'term'
      },
      /**
       * Validation state for submitting the term input value as part of the form
       */
      state: {
        type: Boolean,
        default: null
      },
      /**
       * Enitty type(s) to look up suggestions for the term
       * @values agent,concept,organization,place,timespan
       */
      suggestEntityType: {
        type: String,
        default: null
      },
      /**
       * Value of the term input
       */
      value: {
        type: String,
        default: null
      },
      /**
       * Advanced search field for which the term will the searched value
       */
      advancedSearchField: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        term: this.value,
        showSearchOptions: false,
        selectedValue: null,
        submitting: null
      };
    },

    computed: {
      optionsId() {
        return `${this.id}-options`;
      }
    },

    watch: {
      value() {
        this.term = this.value;
      },
      term(newVal) {
        if (!newVal) {
          this.showSearchOptions = false;
        }
      }
    },

    methods: {
      handleChange() {
        const valueToEmit = this.selectedValue || this.term;

        if (!this.selectedValue) {
          // Set submitting state to track the no autosuggest option selected in SearchQueryOptions
          this.submitting = this.term;
        }

        this.$emit('change', valueToEmit);
        this.selectedValue = null; // reset for next query
      },
      handleSelect(option) {
        this.showSearchOptions = false;
        this.selectedValue = option.query;
        this.handleChange();
      },
      handleFocusOutChange(event) {
        const relatedTargetOutsideSearchDropdown = this.checkIfRelatedTargetOutsideSearchDropdown(event);
        if (relatedTargetOutsideSearchDropdown && this.term !== this.value) {
          this.handleChange();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .input-wrapper {
    position: relative;
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

  .open .form-control {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .auto-suggest-dropdown {
    width: 100%;
    border-radius: 0 0 0.5em 0.5em;
    background-color: $white;
    overflow: hidden;
    position: absolute;
    z-index: 20;
    box-shadow: $boxshadow-light, $boxshadow-light-left;

    @media (min-width: $bp-4k) {
      font-size: 1.5rem;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <SearchQueryBuilderRuleTermInput />
  ```
  With suggestions
  ```jsx
    <SearchQueryBuilderRuleTermInput
      suggestEntityType="concept"
      advanced-search-field="what"
    />
  ```
</docs>
