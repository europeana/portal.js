<template>
  <div
    ref="searchdropdown"
    @keydown="handleKeyDown"
  >
    <b-form-input
      ref="searchinput"
      v-model="term"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      @change="handleChange"
      @focus="showSearchOptions = true"
      @input="showSearchOptions = true"
      @keydown.enter="showSearchOptions = false"
    />
    <template v-if="suggestEntityType">
      <SearchQueryOptions
        v-show="showSearchOptions"
        ref="searchoptions"
        :text="term"
        :type="suggestEntityType"
        :advanced-search="true"
        @select="(selectedValue) => handleSelect(selectedValue)"
        @keydown.enter="(selectedValue) => handleSelect(selectedValue)"
      />
    </template>
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
        valueToEmit: null,
        selectedValue: null
      };
    },

    watch: {
      value() {
        this.term = this.value;
      }
    },

    methods: {
      handleChange(newVal) {
        // Wait for focusout event to close options
        setTimeout(() => {
          if (!this.showSearchOptions) {
            this.$emit('change', newVal);
          }
        }, 500);
      },
      handleSelect(newVal) {
        this.showSearchOptions = false;
        this.handleChange(newVal);
      }
    }
  };
</script>
