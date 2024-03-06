<template>
  <b-container
    class="landing-content-card-group"
    :class="variant"
  >
    <ContentCardSection
      :section="section"
    />
  </b-container>
</template>

<script>
  export default {
    name: 'LandingContentCardGroup',

    components: {
      ContentCardSection: () => import('../content/ContentCardSection')
    },

    props: {
      /**
       * Heading title to display above the illustrations
       */
      section: {
        type: String,
        default: null
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-content-card-group {
    text-align: center;

  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-content-card-group.ds4ch {
    max-width: 100%;
    margin: 0;
    background-color: $bodygrey;

    @media (min-width: $bp-medium) {
      padding-top: 6rem;
      padding-bottom: 8rem;
    }
  }
</style>
