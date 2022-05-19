<template>
  <div
    class="hero"
  >
    <div
      class="hero-content"
    >
      <SearchForm />
    </div>
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';

  export default {
    name: 'HomeIndexPage',

    components: {
      SearchForm
    },

    data() {
      return {
        title: this.$t('homePage.title')
      };
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.title),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'og:title', property: 'og:title', content: this.title }
          // TODO: define description and social media image
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.socialMediaImage ? [
          { hid: 'og:image', property: 'og:image', content: this.socialMediaImageOptimisedUrl },
          { hid: 'og:image:alt', property: 'og:image:alt', content: this.socialMediaImageAlt }
        ] : [])
      };
    }

  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .hero {
    margin-top: -70px;
    background-color: $mediumgrey-light;
    padding: 12rem 1.5rem;
    min-height: 100vh;

    @media (min-width: $bp-medium) {
      font-size: 2vw;
      padding: 6em 0 3em;
    }
  }

  .hero-content {
    margin: 0 auto;

    @media (min-width: $bp-medium) {
      width: 25em;
      min-width: 644px;
    }
  }

</style>
