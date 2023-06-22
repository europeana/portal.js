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

      value: {
        type: String,
        required: true
      },

      state: {
        type: Boolean,
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
