<template>
  <b-form-input
    v-model="term"
    :data-qa="`advanced search query builder: ${name} control`"
    :placeholder="$t('search.advanced.placeholder.term')"
    :state="state"
    @change="(newVal) => $emit('change', newVal)"
  />
</template>

<script>
  export default {
    name: 'SearchQueryBuilderRuleTermInput',

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
        term: this.value
      };
    },

    watch: {
      value() {
        this.term = this.value;
      }
    }
  };
</script>
