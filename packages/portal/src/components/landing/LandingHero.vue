<template>
  <div class="landing-hero">
    <b-container class="hero-container">
      <div
        class="hero-content-wrapper"
      >
        <header class="hero-content">
          <!-- eslint-disable vue/no-v-html -->
          <h1
            v-html="highlightedEuropeanaTitle"
          />
          <!-- eslint-enable vue/no-v-html -->
          <p>
            {{ headline }}
          </p>
          <SmartLink
            v-if="cta"
            :destination="cta.url"
            class="btn btn-cta btn-primary d-inline-flex align-items-center mt-1 mt-md-4"
          >
            {{ cta.text }}
          </SmartLink>
        </header>
      </div>
    </b-container>
    <div
      class="hero-image responsive-backround-image"
      :style="imageCSSVars"
    >
      <AttributionToggle
        :attribution="heroImage"
      />
    </div>
  </div>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'LandingHero',

    components: {
      AttributionToggle,
      SmartLink
    },

    props: {
      title: {
        type: String,
        required: true
      },
      headline: {
        type: String,
        default: null
      },
      cta: {
        type: Object,
        default: null
      },
      heroImage: {
        type: Object,
        default: null
      }
    },

    computed: {
      imageCSSVars() {
        return this.heroImage?.image &&
          this.$contentful.assets.responsiveBackgroundImageCSSVars(
            this.heroImage.image,
            {
              small: { w: 576, h: 265, fit: 'fill' },
              medium: { w: 768, h: 265, fit: 'fill' },
              large: { w: 591, h: 600, fit: 'fill' },
              xl: { w: 695, h: 580, fit: 'fill' },
              xxl: { w: 815, h: 550, fit: 'fill' },
              xxxl: { w: 1074, h: 550, fit: 'fill' },
              wqhd: { w: 1432, h: 800, fit: 'fill' },
              '4k': { w: 2148, h: 800, fit: 'fill' }
            }
          );
      },
      highlightedEuropeanaTitle() {
        return this.title.replace('{{', '<span class="title-highlight">').replace('}}', '</span>');
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/responsive-background-image';

.landing-hero {
  background-color: $bodygrey;
  position: relative
}
.hero-content-wrapper {
  background-color: $bodygrey;
  padding: 3rem 2rem 3rem 0;

  @media (min-width: $bp-medium) {
    width: 65%;
    position: relative;
    z-index: 10;
    padding: 6.25rem 6.25rem 6.25rem 0;

    clip-path: polygon(0% 0%, 100% 0, 100% calc(100% - 209px), calc(100% - 95px) 100%, 0 100%);
  }

  @media (min-width: $bp-large) {
    width: 50%
  }

  // @media (min-width: $bp-xxxl) {
  //   clip-path: polygon(0 0, 100% 0, 100% calc(100% - (209 / 16 * 1vw)), calc(100% - calc(95 / 16 * 1vw)) 100%, 0 100%);
  // clip-path: polygon(0 -100vh, calc(100% - calc(95 / 16 * 1vw)) -100vh, calc(100% - calc(95 / 16 * 1vw)) 0, 100% calc(209 / 16 * 1vw), 100% 100%, 0 100%);
  // padding-left: 18vw !important;
  // padding-right: 18vw !important;
  // }

  @media (min-width: $bp-4k) {
    padding: calc(1.5 * 6.25rem) calc(1.5 * 6.25rem) calc(1.5 * 6.25rem) 0;
  }
}

.hero-content {
  max-width: 443px;

  @media (min-width: $bp-4k) {
    max-width: calc(1.5 * 443px);
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.75rem;

    @media (min-width: $bp-medium) {
      font-size: 2.875rem;
      line-height: 1.2;
    }

    @media (min-width: $bp-4k) {
      font-size: calc(1.5 * 2.875rem);
      margin-bottom: calc(1.5 * 0.75rem);
    }
  }

  p {
    color: $mediumgrey;
  }
}

.hero-image {
  width: 100%;
  min-height: 265px;
  position: relative;

  @media (min-width: $bp-medium) {
    width: calc(40% + 95px);
    margin-left: -95px;
    right: 0;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  @media (min-width: $bp-large) {
    width: calc(50% + 95px);
  }

  // @media (min-width: $bp-xxxl) {
  //   width: calc(50% + (2 * calc(95 / 16 * 1vw)));
  //   margin-left: calc(95 / 16 * -1vw);
  // }

  // @media (min-width: $bp-4k) {
  //   width: calc(50% + (1.5 * 2 * 95px));
  //   margin-left: calc(1.5 * -95px);
  // }

  &::before {
    content: '';
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(0deg, $blue, $blue);
    mix-blend-mode: multiply;
    position: absolute;
  }
}

.responsive-backround-image {
  background-repeat: no-repeat;
  background-color: green;
  background-position: center;
  background-size: cover;
}

::v-deep .title-highlight {
  color: $blue;
}
</style>

<docs lang="md">
  ```jsx
    <LandingHero
      title="This is a {{landing}} page"
      headline="A description what this page is all about"
      :cta="{
        url: 'https://www.europeana.eu',
        text: 'Ga naar Europeana'
      }"
      :hero-image="{
        creator: 'Europeana Foundation',
        license: 'https://creativecommons.org/publicdomain/zero/1.0',
        name: 'Image landing page',
        provider: null,
        url: null,
        image: {
          contentType: 'image/jpeg',
          description: null,
          height: 2694,
          url: 'https://images.ctfassets.net/i01duvb6kq77/1trzaYGwJsR79hW38lMpJO/465bdac6bb52df2f574c50dacdc74ef8/slantedimagecover_v1.jpg',
          width: 4320
        }
      }"
    />
  ```
</docs>