<template>
  <div class="story-hero d-flex flex-column xxl-page">
    <div
      class="hero-background responsive-backround-image"
      :style="imageCSSVars"
      role="img"
      :aria-label="hero?.image?.description"
    />
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
      <AttributionToggle
        :attribution="hero"
      />
    </div>
  </div>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const CSS_VARS_PRESETS = {
    small: { w: 576, h: 896, fit: 'fill' },
    medium: { w: 768, h: 1080, fit: 'fill' },
    large: { w: 992, h: 1080, fit: 'fill' },
    xl: { w: 1200, h: 1080, fit: 'fill' },
    xxl: { w: 1400, h: 1080, fit: 'fill' },
    xxxl: { w: 1880, h: 1080, fit: 'fill' },
    wqhd: { w: 2520, h: 1440, fit: 'fill' },
    '4k': { w: 3020, h: 1440, fit: 'fill' },
    '4k+': { w: 3840, h: 2160, fit: 'fill' }
  };

  export default {
    name: 'StoryHero',

    components: {
      AttributionToggle
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
        default: null
      },

      contextLabel: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        imageCSSVars: this.hero.image &&
          this.$contentful.assets.responsiveBackgroundImageCSSVars(
            this.hero.image,
            CSS_VARS_PRESETS
          )
      };
    },

    mounted() {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.defaults({
        trigger: '.story-hero',
        scrub: true,
        start: 'top top',
        invalidateOnRefresh: true
      });

      const halfHeroHeight = 0.5 * document.querySelector('.story-hero').clientHeight;

      gsap.to('.hero-content', {
        y: -halfHeroHeight,
        scrollTrigger: {}
      });

      gsap.to('.story-hero', {
        y: halfHeroHeight,
        scrollTrigger: {}
      });
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
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 500ms ease-out;

    &::before {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, #000, #000);
      mix-blend-mode: saturation;
      position: absolute;
    }

    &::after {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
      position: absolute;
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
