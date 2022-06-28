<template>
  <b-form
    ref="form"
    data-qa="boost form"
    inline
    autocomplete="off"
    @submit.prevent="submitForm"
  >
    <b-form-input
      ref="boostingInput"
      v-model="boost"
      placeholder="Enter field boosting query"
      name="boost"
      data-qa="boost box"
      aria-autocomplete="list"
    />
  </b-form>
</template>

<script>
  export default {
    name: 'BoostingForm',

    data() {
      return {
        boost: null
      };
    },

    computed: {
      onSearchablePage() {
        return this.$store.state.search.active;
      },

      routePath() {
        return this.onSearchablePage ? this.$route.path : this.$path({ name: 'search' });
      }
    },

    watch: {
      '$route.query.boost'() {
        this.initBoost();
      }
    },

    mounted() {
      this.initBoost();
    },

    methods: {
      initBoost() {
        this.boost = this.$route.query.boost;
      },

      async submitForm() {
        const baseQuery = this.onSearchablePage ? this.$route.query : {};
        const newRouteQuery = { ...baseQuery, ...{ page: 1, view: this.view, boost: this.boost } };
        const newRoute = { path: this.routePath, query: newRouteQuery };

        this.showSearchOptions = false;

        await this.$goto(newRoute);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';
  .form-inline {
    background-color: $white;
    font-size: 1rem;
    height: auto;
    border-radius: 0.5em;
    width: 100%;

    .form-control {
      padding: 1em;
      background-color: $white;
      height: auto;
      color: $mediumgrey;
      width: 100%;

      @media (min-width: $bp-xxxl) {
        font-size: 1rem;
      }
    }
  }
</style>
