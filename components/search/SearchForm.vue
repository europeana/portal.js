<template>
  <b-form
    inline
    @submit.prevent="submitForm"
  >
    <b-form-input
      v-model="query"
      aria-label="Search"
      :placeholder="$t('searchPlaceholder')"
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
        {{ $t('search') }}
      </span>
      <img
        src="../../assets/img/magnifier.svg"
        :alt="$t('search')"
      >
    </b-button>
  </b-form>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
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
    },
    methods: {
      async submitForm() {
        await this.$root.$emit('submit:searchForm', this.query);
        const newRouteQuery = { ...this.$route.query, ...{ query: this.query, page: 1 } };
        const newRoutePath = this.localePath({ name: 'search', query: newRouteQuery });
        this.$router.push(newRoutePath);
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
