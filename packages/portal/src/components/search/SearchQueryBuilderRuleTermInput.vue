<template>
  <div>
    <b-form-input
      v-model="term"
      :data-qa="`advanced search query builder: ${name} control`"
      :placeholder="$t('search.advanced.placeholder.term')"
      :state="state"
      @change="(newVal) => $emit('change', newVal)"
      @focus="showSearchOptions = true"
    />
    <SearchQueryOptions
      v-show="showSearchOptions"
      :text="term"
      @select="(selectedValue) => handleSelect(selectedValue)"
    />
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
        // TODO: pass entity type per field
        default: 'concept'
      },

      value: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        term: this.value,
        showSearchOptions: false
      };
    },

    watch: {
      value() {
        this.term = this.value;
      }
    },

    methods: {
      handleSelect(newVal) {
        this.$emit('change', newVal);
        this.showSearchOptions = false;
      }
    }
  };
</script>
