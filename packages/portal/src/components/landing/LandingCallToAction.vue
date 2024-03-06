<template>
  <div
    class="landing-cta"
    :class="variant"
  >
    <div
      v-if="backgroundImage"
      data-qa="landing cta background image"
      class="background-image responsive-backround-image"
      :class="backgroundImageClasses"
      :style="imageCSSVars"
    />
    <b-container>
      <ContentPrimaryCallToAction
        :title="displayTitle"
        :text="text"
        :link="link"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentPrimaryCallToAction from '@/components/content/ContentPrimaryCallToAction';

  const SIZES_PRESETS = {
    small: { w: 576, h: 350, fit: 'fill' },
    medium: { w: 768, h: 310, fit: 'fill' },
    large: { w: 992, h: 300, fit: 'fill' },
    xl: { w: 1200, h: 300, fit: 'fill' },
    xxl: { w: 1400, h: 300, fit: 'fill' },
    xxxl: { w: 1880, h: 300, fit: 'fill' },
    wqhd: { w: 3020, h: 500, fit: 'fill' },
    '4k': { w: 3840, h: 680, fit: 'fill' }
  };

  export default {
    name: 'LandingCallToAction',

    components: {
      ContentPrimaryCallToAction
    },

    props: {
      /**
       * Title
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Text to display under title
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
       * Background image Object
       */
      backgroundImage: {
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
    },

    data() {
      return {
        backgroundImageClasses: {
          'no-overlay': this.backgroundImage?.profile && !this.backgroundImage.profile.overlay,
          'bg-position-y-center': ['left', 'right'].includes(this.backgroundImage?.profile?.focus),
          'bg-color-highlight': this.backgroundImage?.profile?.background === 'highlight'
        },
        displayTitle: this.variant === 'ds4ch' ? this.title : null,
        imageCSSVars: this.$contentful.assets.responsiveBackgroundImageCSSVars(
          this.backgroundImage?.image,
          SIZES_PRESETS,
          this.backgroundImage?.profile
        )
      };
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
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .landing-cta.ds4ch {
    background-color: $black;
    position: relative;
    color: $white;

    .background-image {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;

      &::after {
        content: '';
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(0deg, rgba(25, 24, 23, 0.6), rgba(25, 24, 23, 0.6));
        mix-blend-mode: multiply;
        position: absolute;
      }

      &.no-overlay::after {
        content: none;
      }

      &.bg-position-y-center {
        background-position-y: center;
      }

      &.bg-color-highlight {
        background-color: $blue;
      }
    }

    .container {
      padding-top: 3.625rem;
      padding-bottom: 2rem;
      position: relative;

      @media (min-width: $bp-4k) {
        padding-top: 7rem;
        padding-bottom: 5rem;
      }

      h2 {
        @media (min-width: $bp-4k) {
          margin-bottom: 4rem;
        }
      }

      .primary-cta {
        background-color: transparent !important;
        padding: 0;
        max-width: $max-text-column-width !important;

        @media (min-width: $bp-4k) {
          max-width: $max-text-column-width-4k !important;
        }
      }
      .primary-cta-rich-text {
        text-align: center !important;
        margin-bottom: 2rem;

        @media (min-width: $bp-4k) {
          font-size: 2.5rem;
          margin-bottom: 3.125rem;
        }
      }
    }
  }
</style>
