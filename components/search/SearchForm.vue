<template>
  <b-form
    inline
    @submit.prevent="submitSearchForm"
  >
    <b-form-input
      id="searchQuery"
      v-model="inputQuery"
      placeholder="What are you looking for?"
      class="mr-2 w-75"
    />
    <b-button
      variant="primary"
      type="submit"
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
      searchQuery: {
        type: String,
        default: ''
      }
    },
    computed:{
      inputQuery: {
        get () {
          return this.searchQuery;
        },
        set (value) {
          this.query = value;
        }
      }
    },
    methods: {
      submitSearchForm () {
        if (this.$route.query.query !== this.query) {
          this.$emit('update', true);
        }
        this.$router.push({ name: 'search', query: { query: this.query ? this.query : '' } });
      }
    }
  };
</script>
