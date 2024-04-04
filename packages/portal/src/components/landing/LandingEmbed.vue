<template>
  <div
    class="landing-embed"
    :class="{ 'background-applied': backgroundImage}"
  >
    <div
      class="header"
      :class="backgroundImageClasses"
      :style="imageCSSVars"
    >
      <b-container>
        <b-col class="header-content col-lg-8 px-0 text-center mx-auto">
          <h2>
            {{ title }}
          </h2>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="text"
            class="text mb-3"
            v-html="parseMarkdownHtml(text)"
          />
          <!-- eslint-enable vue/no-v-html -->
        </b-col>
      </b-container>
    </div>
    <b-container
      class="embed-container text-center"
    >
      <EmbedHTML
        v-if="embed"
        :title="title"
        :html="embed.embed"
      />
      <SmartLink
        v-if="link?.url"
        :destination="link.url"
        class="btn btn-cta btn-outline-primary"
        hide-external-icon
      >
        {{ link.text }}
      </SmartLink>
    </b-container>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import EmbedHTML from '@/components/embed/EmbedHTML';

  const CSS_VARS_PRESETS = {
    small: { w: 576, h: 270, fit: 'fill' },
    medium: { w: 768, h: 270, fit: 'fill' },
    large: { w: 992, h: 500, fit: 'fill' },
    xl: { w: 1200, h: 500, fit: 'fill' },
    xxl: { w: 1400, h: 500, fit: 'fill' },
    xxxl: { w: 1880, h: 500, fit: 'fill' },
    wqhd: { w: 2520, h: 500, fit: 'fill' },
    '4k': { w: 3020, h: 500, fit: 'fill' },
    '4k+': { w: 3840, h: 680, fit: 'fill' }
  };

  export default {
    name: 'LandingEmbed',

    components: {
      EmbedHTML,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [parseMarkdownHtmlMixin],

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
       * Embed Object
       */
      embed: {
        type: Object,
        default: null
      },
      /**
       * Background image Object
       */
      backgroundImage: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        backgroundImageClasses: {
          'background-image responsive-backround-image': this.backgroundImage,
          'no-overlay': this.backgroundImage?.profile && !this.backgroundImage.profile.overlay,
          'bg-position-y-center': ['left', 'right'].includes(this.backgroundImage?.profile?.focus),
          'bg-color-highlight': this.backgroundImage?.profile?.background === 'highlight'
        },
        imageCSSVars: this.backgroundImage?.image && this.$contentful.assets.responsiveBackgroundImageCSSVars(
          this.backgroundImage?.image,
          CSS_VARS_PRESETS,
          this.backgroundImage?.profile
        )
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-embed {
    background-color: $bodygrey;
    padding-bottom: 3rem;

    @media (min-width: $bp-large) {
      padding-bottom: 6rem;
    }

    @media (min-width: $bp-4k) {
      padding-bottom: 15rem;
    }

    &.background-applied {
      background-color: $white;
      padding-bottom: 0;
      margin-bottom: 3rem;

      @media (min-width: $bp-large) {
        margin-bottom: 6rem;
      }

      @media (min-width: $bp-4k) {
        margin-bottom: 15rem;
      }
    }
  }

  .header {
    position: relative;
    padding: 3rem 0 1rem;

    @media (min-width: $bp-medium) {
      padding: 6rem 0 17rem;
    }

    @media (min-width: $bp-4k) {
      padding-top: 15rem;
    }

    &.background-image::before {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;
    }

    &.background-image::after {
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
      color: $white;
    }

    .container {
      position: relative; // Prevents blending with the background
    }

    .header-content {
      @media (min-width: $bp-xxl) {
        max-width: $max-text-column-width;
      }
    }
  }

  .embed-container {
    @media (min-width: $bp-medium) {
      margin-top: -13rem;
      position: relative;
    }

    ::v-deep iframe {
      max-width: 920px;
      width: 100%;
    }

    .btn {
      margin-top: 2rem;

      @media (min-width: $bp-large) {
        margin-top: 4rem;
      }

      @media (min-width: $bp-4k) {
        margin-top: 8rem;
      }
    }
  }

</style>
