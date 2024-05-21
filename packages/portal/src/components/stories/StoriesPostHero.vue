<template>
  <div class="stories-post-hero">
    <div
      class="hero-background responsive-backround-image"
      :style="imageCSSVars"
      role="img"
      :aria-label="hero?.image?.description"
    />
    <b-container class="hero-content">
      <header class="row">
        <b-col
          cols="12"
          lg="6"
          class="col lead mt-3"
        >
          <div
            v-if="contextLabel"
            class="context-label d-inline-block px-2 py-1 mb-3"
          >
            {{ contextLabel }}
          </div>
          <h1>
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="lead"
          >
            {{ description }}
          </p>
          <p>
            {{ `${hero.image.width} x ${hero.image.height}` }}
          </p>
        </b-col>
      </header>
    </b-container>
    <AttributionToggle
      :attribution="hero"
    />
  </div>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';

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
    name: 'StoriesPostHero',

    components: {
      AttributionToggle
    },

    props: {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        default: ''
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .stories-post-hero {
    margin-top: -70px;
    margin-bottom: 4.5rem;
    background-color: $mediumgrey-light;
    padding: 1.5rem;
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    @media (min-width: $bp-4k) {
      margin-top: calc(1.5 * -70px);
      padding-bottom: calc(1.5 * 128px);
    }
  }

  .hero-content {
    position: absolute; // Prevents blending with the background
    bottom: 5rem;
    left: 0;
    right: 0;
    color: $white;

    h1,
    .context-label,
    .lead {
      color: $white;

      @media (min-width: $bp-medium) {
        max-width: 744px;
      }

      @media (min-width: $bp-large) {
        max-width: 80%;
      }
    }

    h1 {
      @extend %title-1;
    }

    .context-label {
      background-color: $blue;
      border-radius: $border-radius-small;
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
</style>
