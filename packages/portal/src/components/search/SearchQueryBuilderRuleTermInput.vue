<template>
  <div
    ref="searchdropdown"
    v-click-outside="clickOutsideConfig"
    class="input-wrapper"
    :class="{ 'open': showSearchOptions }"
    @focusin="handleFocusin"
  >
    <b-form-input
      :id="id"
      v-model="term"
      :name="name"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      role="searchbox"
      aria-autocomplete="list"
      :aria-owns="showSearchOptions ? optionsId : null"
      :aria-controls="showSearchOptions ? optionsId : null"
      @input="handleInput"
      @blur="handleBlur"
    />
    <SearchQueryOptions
      v-show="showSearchOptions"
      :id="optionsId"
      v-model="selectedOption"
      :data-qa="`advanced search query builder: ${name} search options`"
      class="auto-suggest-dropdown"
      :text="term"
      :type="suggestEntityType"
      :suggest="!!suggestEntityType && showSearchOptions"
      :advanced-search="true"
      :advanced-search-field="advancedSearchField"
      :show-search-options="showSearchOptions"
      :submitting="submitting"
      @input="handleSelectedOptionInput"
      @hide="handleChange"
    />
  </div>
</template>

<script>
  import vClickOutside from 'v-click-outside';

  import SearchQueryOptions from './SearchQueryOptions';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilderRuleTermInput',

    components: {
      SearchQueryOptions
    },

    directives: {
      clickOutside: vClickOutside.directive
    },

    mixins: [advancedSearchMixin],

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
       * Entity type(s) to look up suggestions for the term
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
       * Advanced search field for which the term will be the searched value
       */
      advancedSearchField: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        // https://www.npmjs.com/package/v-click-outside
        clickOutsideConfig: {
          capture: true,
          events: ['click', 'dblclick', 'focusin', 'touchstart'],
          handler: this.handleClickOutside,
          isActive: false,
          middleware(event) {
            return event.target?.tagName !== 'A';
          }
        },
        selectedOption: null,
        showSearchOptions: false,
        submitting: null,
        term: this.value
      };
    },

    computed: {
      optionsId() {
        return `${this.id}-options`;
      },
      fieldNeedsEntityLookUp() {
        return this.advancedSearchFieldsForEntityLookUp.map(field => field?.name)
          .includes(this.advancedSearchField);
      }
    },

    watch: {
      value() {
        this.term = this.value;
      }
    },

    methods: {
      setClickOutsideConfigIsActive(isActive) {
        // need to do this instead of just setting isActive due to
        // https://github.com/ndelvalle/v-click-outside/issues/143
        this.clickOutsideConfig = {
          ...this.clickOutsideConfig,
          isActive
        };
      },
      handleClickOutside() {
        this.handleChange();
        this.setClickOutsideConfigIsActive(false);
      },
      handleFocusin() {
        this.setClickOutsideConfigIsActive(true);
      },
      handleBlur() {
        !this.showSearchOptions && this.handleChange();
      },
      handleChange() {
        this.$emit('change', this.term);
        this.showSearchOptions = false;
        this.selectedOption = null;
      },
      handleInput(value) {
        this.showSearchOptions = (value.length > 0);
        this.$emit('input', value);
      },
      handleSelectedOptionInput(option) {
        this.$emit('input', option.query);
        this.handleChange();

        this.fieldNeedsEntityLookUp && this.$store.commit(
          'search/addQasWithSelectedEntityValue',
          { field: this.advancedSearchField, qa: option.query, id: option.entityId }
        );
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
    border: 1px solid $lightgrey;
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
      suggest-entity-type="concept"
      advanced-search-field="what"
    />
  ```
</docs>
