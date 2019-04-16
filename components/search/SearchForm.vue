<template>
  <b-form
    inline
    data-qa="search form"
    @submit.prevent="$emit('submit:searchForm')"
  >
    <b-form-input
      v-model="query"
      aria-label="Search"
      placeholder="What are you looking for?"
      name="query"
      data-qa="search box"
      @input="$emit('input', $event)"
    />
    <b-button
      type="submit"
      data-qa="search button"
      variant="primary"
    >
      <span>
        Search
        <LoadingSpinner
          v-show="isLoading"
          class="ml-2 mb-1"
        />
      </span>
      <img
        src="../../assets/img/magnifier.svg"
        alt="Search"
      >
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

<style lang="scss">
  @import "./assets/scss/variables.scss";

  .form-inline .form-control {
    background-color: $white;
    margin-right: 0.5rem;
    width: 70%;
  }

  .btn img {
    display: none;
  }

  .navbar {
    .form-control {
      background-color: $lightgrey;
      border-radius: $border-radius 0 0 $border-radius;
      margin-right: 0;
      width: calc(100% - 40px);
    }

    .btn {
      border-radius: 0 $border-radius $border-radius 0;

      span {
        display: none;
      }

      img {
        display: block;
      }
    }
  }
</style>
