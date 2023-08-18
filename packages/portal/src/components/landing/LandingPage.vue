<template>
  <div
    class="page white-page xxl-page"
  >
    <LandingHero
      :title="title"
      :headline="html(headline)"
      :cta="cta"
      :hero-image="primaryImageOfPage"
    />
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';
  import { marked } from 'marked';

  export default {
    name: 'LandingPage',

    components: {
      LandingHero
    },

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
        return marked.parse(text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      margin-top: -1.5rem;
    }
  }
</style>
