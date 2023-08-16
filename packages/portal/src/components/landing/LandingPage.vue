<template>
  <div
    class="page white-page xxl-page"
  >
    <div>
      <h1>{{ title }}</h1>
      <p>{{ headline }}</p>
    </div>
    <!-- Header/hero -->
  </div>
</template>

<script>
  export default {
    name: 'LandingPage',

    props: {
      page: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        title: this.page.name,
        headline: this.page.headline,
        cta: this.page.relatedLink,
        sections: this.page.hasPartCollection.items.filter((item) => !!item),
        primaryImageOfPage: this.page.primaryImageOfPage
      };
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
