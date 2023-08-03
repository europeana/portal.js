<template>
  <div>
    <b-form-input
      v-model="term"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      @change="handleChange"
      @focus="showSearchOptions = true"
      @input="showSearchOptions = true"
      @blur="handleChange"
    />
    <template v-if="suggestEntityType">
      <SearchQueryOptions
        v-show="showSearchOptions"
        :text="term"
        :type="suggestEntityType"
        :advanced-search="true"
        @select="(selectedValue) => handleSelect(selectedValue)"
      />
    </template>
  </div>
</template>

<script>
  import SearchQueryOptions from './SearchQueryOptions';

  export default {
    name: 'SearchQueryBuilderRuleTermInput',

    components: {
      SearchQueryOptions
    },

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
      handleChange() {
        // Wait for SearchQueryOptions select event
        setTimeout(() => {
          this.valueToEmit = this.selectedValue || this.term;

          if (this.valueToEmit !== this.value) {
            this.$emit('change', this.valueToEmit);
          }

          this.showSearchOptions = false;
        }, 500);
      },
      handleSelect(newVal) {
        this.selectedValue = newVal;
      }
    }
  };
</script>
