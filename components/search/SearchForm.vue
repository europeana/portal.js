<template>
  <b-form
    inline
    @submit.prevent="submitForm"
  >
    <b-form-input
      v-model="query"
      :aria-label="$t('search')"
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
    data() {
      return {
        inputQuery: this.query
      };
    },
    computed: {
      onSearchPage() {
        return this.$store.state.search.active;
      },
      query: {
        get() {
          return this.onSearchPage ? this.$store.state.search.query : '';
        },
        set(value) {
          this.inputQuery = value;
        }
      },
      routePath() {
        if (this.onSearchPage) {
          return this.$route.path;
        } else {
          return this.localePath({ name: 'search' });
        }
      },
      view() {
        return this.$store.getters['search/activeView'];
      }
    },
    updated() {
      this.inputQuery = this.query;
    },
    methods: {
      async submitForm() {
        const newRouteQuery = { ...this.$route.query, ...{ query: this.inputQuery, page: 1, view: this.view } };
        const newRoute = { path: this.routePath, query: newRouteQuery };
        await this.$router.push(newRoute);
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
