<template>
  <div
    ref="landingContentCardGroup"
    class="landing-content-card-group"
    :class="[variant, `landing-content-card-group-${parity}`]"
    data-qa="landing content card group"
  >
    <b-container>
      <ContentCardSection
        :section="section"
        :title-tag="titleTag"
      />
    </b-container>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import useRefParity from '@/composables/refParity.js';
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
       * @values pro, ds4ch
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

    setup(props) {
      const landingContentCardGroup = ref(null);
      if (props.variant === 'ds4ch') {
        const { parity } = useRefParity('landing-content-card-group', landingContentCardGroup);
        return { parity, landingContentCardGroup };
      } else {
        return { parity: null, landingContentCardGroup };
      }
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
    }

    ::v-deep h2.card-group-title {
      color: $black;
    }

    ::v-deep .browse-section .text {
      text-align: center;
    }

    ::v-deep .card-deck {
      justify-content: center;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .landing-content-card-group.ds4ch {
    &.landing-content-card-group-odd {
      background-color: $bodygrey;
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

    .container {
      padding-left: 15px;
      padding-right: 15px;
    }

    ::v-deep .col-lg-6 {
      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k !important;
        margin-bottom: 9rem;
      }
    }

    ::v-deep h2.card-group-title {
      color: $black;
    }

    ::v-deep .text {
      color: $black;

      @media (min-width: $bp-4k) {
        font-size: 2.5rem;
      }
    }

    ::v-deep .content-card {
      @media (min-width: $bp-4k) {
        min-height: 57rem;
        border-radius: 0.5rem;
      }

      .card-body {
        @media (min-width: $bp-4k) {
          padding: 2.5rem;
        }
      }

      .card-title {
        @media (min-width: $bp-4k) {
          font-size: 3.125rem;
        }
      }

      .card-text {
        color: $black;
        @media (min-width: $bp-4k) {
          font-size: 2.5rem;
          line-height: 1.5;
        }
      }

      .card-img {
        @media (min-width: $bp-4k) {
          max-height: 30.5rem;
          border-radius: 0.5rem 0.5rem 0 0;
        }
      }
    }

    ::v-deep .card-deck-4-cols {
      .card {
        @media (min-width: $bp-4k) {
          max-width: none;
          flex: 0 0 calc(100% / 4 - 45px);
        }
      }
    }
  }
</style>
