<template>
  <b-container :class="variant">
    <ContentPrimaryCallToAction
      :text="text"
      :link="link"
    />
  </b-container>
</template>

<script>
  import ContentPrimaryCallToAction from '@/components/content/ContentPrimaryCallToAction';
  export default {
    name: 'LandingCallToAction',

    components: {
      ContentPrimaryCallToAction
    },

    props: {
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Link Object
       */
      link: {
        type: Object,
        default: () => {}
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

  .container {
    padding-top: 3.75rem;
    padding-bottom: 2rem;

    @media (min-width: $bp-medium) {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }

    .primary-cta {
      margin-left: auto !important;
      margin-right: auto !important;

      @media (min-width: $bp-large) {
        width: 100% !important;
        max-width: 960px;
      }
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss">
  @import '@europeana/style/scss/DS4CH/style';

  .container.ds4ch {
    padding-top: 6rem;
    padding-bottom: 6rem;

    @media (min-width: ($bp-large)) {
      margin-left: 2rem;
    }

    @media (min-width: ($bp-extralarge)) {
      margin-left: 4rem;
    }

    @media (min-width: ($bp-4k)) {
      margin-left: 10rem;
      padding-top: 16rem;
      padding-bottom: 16rem;
    }

    .primary-cta {
      background-color: transparent;
      padding: 0;
      max-width: $max-card-width !important;

      @media (min-width: ($bp-large)) {
        text-align: left !important;
        margin-left: 0 !important;
      }

      @media (min-width: $bp-4k) {
        max-width: 1250px !important;
      }
    }
    .primary-cta-rich-text {
      text-align: center !important;

      @media (min-width: ($bp-medium)) {
        margin-bottom: 2rem;
      }

      @media (min-width: ($bp-large)) {
        text-align: left !important;
      }

      @media (min-width: $bp-4k) {
        font-size: 2.667rem;
        margin-bottom: 6rem;
      }

      h2 {
        @extend %title-2;

        @media (min-width: $bp-4k) {
          margin-bottom: 4rem;
        }
      }
    }
  }
</style>
