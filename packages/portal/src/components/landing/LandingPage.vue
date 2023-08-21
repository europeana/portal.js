<template>
  <div
    class="page white-page xxl-page"
  >
    <div>
      <!-- eslint-disable vue/no-v-html -->
      <h1 v-html="html(title)" />
      <!-- eslint-enable vue/no-v-html -->
      <p>{{ headline }}</p>
    </div>
    <!-- Header/hero -->
  </div>
</template>

<script>
  import { marked } from 'marked';

  export default {
    name: 'LandingPage',

    props: {
      title: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      cta: {
        type: Object,
        default: null
      },
      sections: {
        type: Array,
        default: () => []
      },
      primaryImageOfPage: {
        type: Object,
        default: null
      }
    },

    methods: {
      html(text) {
        return text ? marked.parse(text) : text;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }
  }
</style>
