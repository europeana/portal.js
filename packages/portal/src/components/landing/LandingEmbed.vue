<template>
  <div
    :id="containerId"
    class="landing-embed"
  >
    <div
      class="header responsive-backround-image"
      :style="imageCSSVars"
    >
      <b-container>
        <b-col class="header-content col-lg-8 text-center mx-auto">
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
      v-if="embed"
      class="embed-container"
    >
      <EmbedHTML
        :html="embed.embed"
      />
    </b-container>
  </div>
</template>

<script>
  import kebabCase from 'lodash/kebabCase';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import EmbedHTML from '@/components/embed/EmbedHTML';

  const SRCSET_PRESETS = {
    small: { w: 576, h: 360, fit: 'fill' },
    medium: { w: 768, h: 270, fit: 'fill' },
    large: { w: 992, h: 480, fit: 'fill' },
    xl: { w: 1200, h: 480, fit: 'fill' },
    xxl: { w: 1440, h: 480, fit: 'fill' },
    xxxl: { w: 1920, h: 480, fit: 'fill' },
    wqhd: { w: 2560, h: 480, fit: 'fill' },
    '4k': { w: 3840, h: 480, fit: 'fill' }
  };

  export default {
    name: 'LandingEmbed',

    components: {
      EmbedHTML
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      title: {
        type: String,
        default: null
      },
      text: {
        type: String,
        default: null
      },
      backgroundImage: {
        type: Object,
        default: null
      },
      embed: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        containerId: kebabCase(this.title)
      };
    },

    computed: {
      imageCSSVars() {
        return this.backgroundImage?.image &&
          this.$contentful.assets.responsiveBackgroundImageCSSVars(
            this.backgroundImage.image, SRCSET_PRESETS);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .landing-embed {
    border-bottom: 1px solid $white;
  }

  .header {
    color: $white;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding: 3.5rem 0;

    @media (min-width: $bp-medium) {
      padding: 4rem 0 17rem;
    }

    &::before {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, #0b60aa, #0b60aa);
      mix-blend-mode: multiply;
      position: absolute;
    }

    .container {
      position: relative; // Prevents blending with the background
    }

    .header-content {
      @media (min-width: $bp-xxl) {
        max-width: $max-text-column-width;
      }
    }

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
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
      min-height: 1200px;
    }
  }

</style>
