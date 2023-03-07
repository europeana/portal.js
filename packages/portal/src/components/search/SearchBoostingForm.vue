<template>
  <b-form
    data-qa="boost form"
    inline
    @submit.prevent="submitForm"
  >
    <b-form-input
      v-model="boost"
      :placeholder="$t('search.boost.placeholder')"
      name="boost"
      data-qa="boost box"
    />
  </b-form>
</template>

<script>
  export default {
    name: 'SearchBoostingForm',

    data() {
      return {
        boost: null
      };
    },

    fetch() {
      this.boost = this.$route.query.boost;
    },

    watch: {
      '$route.query.boost'() {
        this.$fetch();
      }
    },

    methods: {
      submitForm() {
        this.$goto({
          path: this.$route.path,
          query: { ...this.$route.query, ...{ page: 1, boost: this.boost } }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .form-inline {
    background-color: $white;
    font-size: $font-size-base;
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
        font-size: $font-size-base;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
      }
    }
  }
</style>
