<template>
  <b-form
    inline
    data-qa="search form"
    @submit.prevent="$emit('submit:searchForm')"
  >
    <b-form-input
      v-model="query"
      placeholder="What are you looking for?"
      name="query"
      class="mr-2 w-75"
      data-qa="search box"
      @input="$emit('input', $event)"
    />
    <b-button
      type="submit"
      data-qa="search button"
    >
      Search
      <LoadingSpinner
        v-show="isLoading"
        class="ml-2 mb-1"
      />
    </b-button>
  </b-form>
</template>

<script>
  import LoadingSpinner from '../generic/LoadingSpinner';

  export default {
    components: {
      LoadingSpinner
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        query: this.value
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.query = val;
        }
      }
    }
  };
</script>
