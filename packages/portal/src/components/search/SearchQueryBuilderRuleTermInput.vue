<template>
  <div
    ref="searchdropdown"
    class="input-wrapper"
    :class="{ 'open': showSearchOptions }"
    @keydown="handleKeyDown"
  >
    <b-form-input
      ref="searchinput"
      v-model="term"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      @change="handleChange"
      @input="showSearchOptions = true"
      @keydown.enter="showSearchOptions = false"
    />
    <SearchQueryOptions
      v-show="showSearchOptions"
      ref="searchoptions"
      class="auto-suggest-dropdown"
      :text="term"
      :type="suggestEntityType"
      :suggest="suggestEntityType"
      :advanced-search="true"
      @select="(selectedValue, selectedEntity) => handleSelect(selectedValue, selectedEntity, 'select')"
      @keydown.enter="(selectedValue, selectedEntity) => handleSelect(selectedValue, selectedEntity, 'enter')"
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
      }
    },

    data() {
      return {
        term: this.value,
        showSearchOptions: false,
        selectedValue: null
      };
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
      handleChange(newVal) {
        // Wait for focusout event to close options
        setTimeout(() => {
          if (!this.showSearchOptions) {
            const valueToEmit = this.selectedValue || newVal;
            this.$emit('change', valueToEmit);
          }
        }, 500);
      },
      handleSelect(newVal, entityId) {
        this.showSearchOptions = false;
        console.log(entityId);
        this.selectedValue = newVal;
        this.handleChange();
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
