<template>
  <div
    ref="searchdropdown"
    class="input-wrapper"
    :class="{ 'open': showSearchOptions }"
    @keydown="handleKeyDown"
    @focusout="handleFocusOutChange"
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
      id: {
        type: String,
        default: null
      },

      name: {
        type: String,
        default: 'term'
      },

      state: {
        type: Boolean,
        default: null
      },

      /**
       * @values Agent,Concept,Organization,Place,Timespan
       */
      suggestEntityType: {
        type: String,
        default: null
      },

      value: {
        type: String,
        default: null
      },

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
