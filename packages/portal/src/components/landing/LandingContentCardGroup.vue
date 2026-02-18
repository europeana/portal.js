<template>
  <div
    ref="landingContentCardGroup"
    class="landing-content-card-group"
    :class="variant"
    data-qa="landing content card group"
  >
    <b-container>
      <ContentCardSection
        :section="section"
        :title-tag="titleTag"
        more-button-class="btn-outline-primary mt-5"
      />
    </b-container>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import ContentCardSection from '../content/ContentCardSection';

  export default {
    name: 'LandingContentCardGroup',

    components: {
      ContentCardSection
    },

    props: {
      /**
       * Section with content card group contents
       */
      section: {
        type: Object,
        default: null
      },
      /**
       * Variant to define layout and style
       * @values pro
       */
      variant: {
        type: String,
        default: 'pro'
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      }
    },

    setup() {
      const landingContentCardGroup = ref(null);
      return { landingContentCardGroup };
    },

    data() {
      return {
        refName: ''
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-content-card-group {
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 1.5rem;

    @media (min-width: $bp-large) {
      margin-top: 6rem;
      margin-bottom: 4.5rem;
    }

    @media (min-width: $bp-4k) {
      margin-top: 15rem;
      margin-bottom: 13.5rem;
    }

    ::v-deep .col-lg-6 {
      text-align: center;
      margin-right: auto;
      margin-bottom: 1rem;
      margin-left: auto;
      padding-left: 2rem;
      padding-right: 2rem;
      flex: 0 1 auto;
      max-width: $max-text-column-width !important;

      @media (min-width: $bp-large) {
        margin-bottom: 3rem;
      }

      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k !important;
      }
    }

    ::v-deep h2.card-group-title {
      color: $black;
    }

    ::v-deep .browse-section .text {
      text-align: center;
    }

    ::v-deep .card-deck {
      justify-content: center;

      @media (min-width: $bp-4k) {
        max-width: calc(4 * (#{$max-card-width} + #{$grid-gutter-4k * 2}));
        margin-left: auto;
        margin-right: auto;
      }
    }

    ::v-deep .card-deck-4-cols .card {
      @media (min-width: $bp-wqhd) {
        flex-basis: calc(100% / 4 - #{$grid-gutter * 2})
      }

      @media (min-width: $bp-4k) {
        flex-basis: calc(100% / 4 - #{$grid-gutter-4k * 2});
      }

      .card-body {
        @media (min-width: $bp-4k) {
          padding: 2rem;
        }
      }

      .card-title {
        @media (min-width: $bp-4k) {
          font-size: calc(2 * $font-size-base);
        }
      }

      .card-subtitle {
        @media (min-width: $bp-4k) {
          font-size: calc(2 * $font-size-extrasmall);
        }
      }

      .card-text {
        @media (min-width: $bp-4k) {
          font-size: calc(2 * $font-size-small);
          line-height: calc(2 * 1.1875rem);
        }
      }
    }
  }

  @at-root .landing-sub-section .landing-content-card-group {
    margin-top: 0;
  }

  @at-root .bg-color-alternate > .landing-content-card-group {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 3rem;
    padding-bottom: 1.5rem;

    @media (min-width: $bp-large) {
      padding-top: 6rem;
      padding-bottom: 4.5rem;
    }

    @media (min-width: $bp-4k) {
      padding-top: 15rem;
      padding-bottom: 13.5rem;
    }
  }
</style>
