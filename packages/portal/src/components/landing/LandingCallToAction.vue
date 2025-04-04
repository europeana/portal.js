<template>
  <div
    class="landing-cta"
    :class="[variant, { 'bg-lightgrey': defaultBackground }]"
  >
    <div
      v-if="backgroundImage"
      data-qa="landing cta background image"
      class="background-image responsive-backround-image"
      :class="backgroundImageClasses"
      :style="imageCSSVars"
    />
    <b-container
      :class="backgroundImage?.profile ? 'text-white' : ''"
    >
      <ContentPrimaryCallToAction
        :title="title"
        :text="text"
        :link="link"
        :button-variant="variant === 'ds4ch' ? 'btn-primary': 'btn-outline-primary'"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentPrimaryCallToAction from '@/components/content/ContentPrimaryCallToAction';
  import { responsiveContentfulBackgroundImageCSSVars } from '@/utils/contentful/assets.js';

  const CSS_VARS_PRESETS = {
    small: { w: 576, h: 350, fit: 'fill' },
    medium: { w: 768, h: 310, fit: 'fill' },
    large: { w: 992, h: 300, fit: 'fill' },
    xl: { w: 1200, h: 300, fit: 'fill' },
    xxl: { w: 1400, h: 300, fit: 'fill' },
    xxxl: { w: 1880, h: 300, fit: 'fill' },
    wqhd: { w: 2520, h: 350, fit: 'fill' },
    '4k': { w: 3020, h: 350, fit: 'fill' },
    '4k+': { w: 3840, h: 680, fit: 'fill' }
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
        imageCSSVars: this.backgroundImage?.image && responsiveContentfulBackgroundImageCSSVars(
          this.backgroundImage?.image,
          CSS_VARS_PRESETS,
          this.backgroundImage?.profile
        ),
        defaultBackground: this.variant === 'pro' && !this.backgroundImage?.profile && !this.backgroundImage?.image
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-cta {
    background-color: $lightgrey;
    position: relative;
  }

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

    .primary-cta {
      margin-left: auto !important;
      margin-right: auto !important;
      background-color: transparent !important;
      padding: 0;
      max-width: 535px !important;

      @media (min-width: $bp-large) {
        width: 100% !important;
        max-width: 960px;
      }

      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k !important;
      }
    }

    ::v-deep .primary-cta-rich-text {
      text-align: center !important;
      margin-bottom: 2rem;

      @media (min-width: $bp-4k) {
        margin-bottom: 3.125rem;
      }
    }

    ::v-deep &.text-white .primary-cta-rich-text a {
      color: $white;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .landing-cta.ds4ch {
    background-color: $black;
    color: $white;
  }
</style>
