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
    <template v-if="suggestEntityType">
      <SearchQueryOptions
        v-show="showSearchOptions"
        :text="term"
        :type="suggestEntityType"
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
