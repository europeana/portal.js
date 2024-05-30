<template>
  <div class="story-hero d-flex flex-column xxl-page">
    <div
      class="hero-background"
    >
      <ImageWithAttribution
        id="hero-background-image"
        ref="heroBackground"
        :alt="heroImageAltText"
        :src="hero.image.url"
        :content-type="heroImage.contentType"
        :attribution="hero"
        :image-srcset="imageSrcset"
        :image-srcset-portrait="imageSrcsetPortrait"
        :lazy="false"
        width="auto"
        height="auto"
        :max-width="null"
      />
    </div>
    <div
      class="hero-content"
    >
      <b-container class="hero-content-container">
        <header class="row">
          <b-col
            cols="12"
            lg="6"
            class="col lead mt-3 mb-0"
          >
            <div
              v-if="contextLabel"
              class="context-label d-inline-block px-2 py-1 mb-3"
            >
              {{ contextLabel }}
            </div>
            <h1 class="title">
              {{ title }}
            </h1>
            <p
              v-if="subtitle"
              class="subtitle"
            >
              {{ subtitle }}
            </p>
          </b-col>
        </header>
      </b-container>
    </div>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import ImageWithAttribution from '@/components/image/ImageWithAttribution';

  const FULL_VIEWPORT_PRESETS_LANDSCAPE = {
    small: { w: 576, h: 576, fit: 'fill' },
    medium: { w: 768, h: 768, fit: 'fill' },
    large: { w: 992, h: 992, fit: 'fill' },
    xl: { w: 1200, h: 1080, fit: 'fill' },
    xxl: { w: 1400, h: 1080, fit: 'fill' },
    xxxl: { w: 1880, h: 1080, fit: 'fill' },
    wqhd: { w: 2520, h: 1440, fit: 'fill' },
    '4k': { w: 3020, h: 1440, fit: 'fill' },
    '4k+': { w: 3840, h: 2160, fit: 'fill' }
  };

  const FULL_VIEWPORT_PRESETS_PORTRAIT = {
    small: { w: 576, h: 1024, fit: 'fill' },
    medium: { w: 768, h: 1365, fit: 'fill' },
    large: { w: 992, h: 1764, fit: 'fill' },
    xl: { w: 1200, h: 2133, fit: 'fill' },
    xxl: { w: 1400, h: 2489, fit: 'fill' },
    xxxl: { w: 1880, h: 3342, fit: 'fill' },
    wqhd: { w: 2520, h: 4480, fit: 'fill' },
    '4k': { w: 3020, h: 3020, fit: 'fill' },
    '4k+': { w: 3840, h: 3840, fit: 'fill' }
  };

  export default {
    name: 'StoryHero',

    components: {
      ImageWithAttribution
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String,
        default: null
      },

      hero: {
        type: Object,
        required: true
      },

      contextLabel: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        heroImage: this.hero.image || null,
        heroImageAltText: this.hero.image?.description || '',
        imageSrcset: this.hero.image &&
          this.$contentful.assets.responsiveImageSrcset(
            this.hero.image,
            FULL_VIEWPORT_PRESETS_LANDSCAPE
          ),
        imageSrcsetPortrait: this.hero.image &&
          this.$contentful.assets.responsiveImageSrcset(
            this.hero.image,
            FULL_VIEWPORT_PRESETS_PORTRAIT
          )
      };
    },

    mounted() {
      window.addEventListener('scroll', this.parallaxBackground);
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.parallaxBackground);
    },

    methods: {
      parallaxBackground() {
        const scrollPosition = window.scrollY || 1;
        const heroBackgroundImageElement = document.querySelector('#hero-background-image img');
        const heroBackgroundHeight = heroBackgroundImageElement.clientHeight || 1;

        if (scrollPosition <= heroBackgroundHeight) {
          const translate = (scrollPosition / heroBackgroundHeight) * 75;
          heroBackgroundImageElement.style.transform = `translateY(${translate}%)`;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .story-hero {
    margin-top: -70px;
    background-color: $mediumgrey-light;
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    @media (min-width: $bp-4k) {
      margin-top: calc(1.5 * -70px);
    }
  }

  .hero-content {
    position: relative; // Prevents blending with the background
    padding-top: 5rem;
    margin-top: auto;
    z-index: 2;
  }

  .hero-content-container {
    padding-bottom: 3.5rem;
    color: $white;

    @media (min-width: $bp-medium) {
      padding-bottom: 5.5rem;
    }

    ::v-deep .title h1,
    .subtitle,
    .context-label {
      color: $white;
    }

    .title {
      @extend %title-1;
    }

    .subtitle {
      font-family: $font-family-sans-serif;
      font-size: $font-size-large;
      font-weight: 600;
      display: block;
      font-style: normal;
      margin: 0.5rem 0 0;

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * $font-size-large);
        margin: 0.75rem 0 0;
      }
    }

    .context-label {
      background-color: $blue;
      border-radius: $border-radius-small;

      @media (min-width: $bp-4k) {
        border-radius: $border-radius-large;
        padding: 0.5rem 1rem !important;
        margin-bottom: 1.5rem !important;
      }
    }
  }

  .hero-background {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: absolute;

    &::before {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, #000, #000);
      mix-blend-mode: saturation;
      position: absolute;
      z-index: 1;
    }

    &::after {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
      position: absolute;
      z-index: 1;
    }

    ::v-deep figure {
      position: static;
      height: 100%;
      width: 100%;

      img {
        height: 100%
      }
    }
  }

  ::v-deep .icon-info {
    bottom: 15px;
    left: 15px;
    right: auto;
    z-index: 3;

    @media (min-width: $bp-medium) {
      bottom: 1.5rem;
      left: 1.5rem;
    }
  }

  ::v-deep cite {
    bottom: 0.5rem;
    left: 0.5rem;
    right: auto !important;
    z-index: 3;
  }
</style>
