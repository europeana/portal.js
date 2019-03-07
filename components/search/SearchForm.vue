<template>
  <b-form
    :class="{'justify-content-center justify-content-sm-end' : inHeader}"
    inline
    data-qa="search form"
    @submit.prevent="$emit('submit:searchForm')"
  >
    <b-form-input
      v-model="query"
      :size="inputSize"
      placeholder="What are you looking for?"
      name="query"
      class="mr-2 w-75"
      data-qa="search box"
      @input="$emit('input', $event)"
    />
    <b-button
      :size="inputSize"
      type="submit"
      data-qa="search button"
    >
      <img
        v-if="inHeader"
        src="../../assets/img/magnifier.svg"
        alt="Search"
      >
      <template v-else>
        Search
        <LoadingSpinner
          v-show="isLoading"
          class="ml-2 mb-1"
        />
      </template>
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
      inHeader: {
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
        query: this.value,
        inputSize: this.inHeader ? 'sm' : ''
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
