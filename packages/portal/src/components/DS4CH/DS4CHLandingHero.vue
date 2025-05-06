<template>
  <div class="landing-hero">
    <div
      class="hero-background responsive-backround-image"
      :style="imageCSSVars"
      role="img"
      :aria-label="heroImage?.image?.description"
      :alt="heroImage?.image?.description"
    />
    <b-container
      class="hero-content d-flex"
    >
      <header class="mt-auto mb-auto">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="hero-content-text-block"
          v-html="parseMarkdown(`# ${headline}\n${text}`)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <SmartLink
          v-if="cta"
          :destination="cta.url"
          class="btn btn-primary d-inline-flex align-items-center mt-1 mt-md-4 mb-0"
        >
          {{ cta.text }}
        </SmartLink>
      </header>
      <div
        id="europeana-logo"
      >
        <p class="text-uppercase mb-0">
          {{ $t('ds4ch.broughtBy') }}
          <img
            :src="europeanaLogoSrc"
            alt="Europeana"
          >
        </p>
      </div>
    </b-container>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import { responsiveContentfulBackgroundImageCSSVars } from '@/utils/contentful/assets.js';
  import parseMarkdown from '@/utils/markdown/parse.js';

  const CSS_VARS_PRESETS = {
    small: { w: 576, h: 896, fit: 'fill', q: 100, f: 'right' },
    medium: { w: 768, h: 1080, fit: 'fill', q: 100, f: 'right' },
    large: { w: 992, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xl: { w: 1200, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xxl: { w: 1400, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xxxl: { w: 1880, h: 1080, fit: 'fill', q: 100, f: 'right' },
    wqhd: { w: 2520, h: 1440, fit: 'fill', q: 100, f: 'right' },
    '4k': { w: 3020, h: 1440, fit: 'fill', q: 100, f: 'right' },
    '4k+': { w: 3840, h: 2160, fit: 'fill', q: 100, f: 'right' }
  };

  export default {
    name: 'DS4CHLandingHero',

    components: {
      SmartLink
    },

    props: {
      /**
       * H1 title to display in the hero.
       */
      headline: {
        type: String,
        required: true
      },
      /**
       * text to display accompanying the headline
       */
      text: {
        type: String,
        default: null
      },
      /**
       * CTA button to link to a URL or section of the page
       */
      cta: {
        type: Object,
        default: null
      },
      /**
       * Image used as background
       * Gets a black overlay (medium portrait)
       */
      heroImage: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        europeanaLogoSrc: require('@europeana/style/img/logo.svg'),
        imageCSSVars: this.heroImage?.image &&
          responsiveContentfulBackgroundImageCSSVars(
            this.heroImage.image,
            CSS_VARS_PRESETS
          )
      };
    },

    methods: {
      parseMarkdown
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .landing-hero {
    overflow: hidden;
    height: 100vh;
    min-height: 37rem;
    position: relative;
    background-color: $black;

    @media (min-width: ($bp-small)) {
      min-height: 30rem;
    }

    @media (min-width: ($bp-medium)) {
      min-height: 40rem;
    }

    @media (min-width: ($bp-large)) {
      min-height: 46rem;
    }

    @media (min-width: ($bp-wqhd)) {
      min-height: 53rem;
    }

    @media (min-width: ($bp-4k)) {
      min-height: 78rem;
    }

    .hero-content {
      left: 0;
      top: 3.5rem;
      right: 0;
      bottom: 0;
      position: absolute;
      margin: -3.5rem 0 0 0;
      padding: 7.5rem 4rem 4rem;
      max-width: 100%;
      flex-direction: column;

      @media (min-width: ($bp-medium)) {
        padding: 8rem;
      }

      @media (min-width: ($bp-wqhd)) {
        padding: 14rem 16rem; // top and bottom have slightly less spacing
      }

      @media (min-width: ($bp-4k)) {
        top: 5.125rem;
        margin: -5.125rem 0 0 0;
      }

      header {
        position: relative;
        z-index: 1;
      }
      .hero-content-text-block {
        margin-bottom: auto;
        margin-top: auto;

        @media (min-width: ($bp-small)) {
          max-width: 70%;
        }

        @media (min-width: ($bp-large)) {
          max-width: 36rem;
        }
        @media (min-width: ($bp-4k)) {
          max-width: 72rem;
        }
      }

      ::v-deep h1 {
        color: $white;
        text-align: left;
        font-family: $font-family-montserrat;
        font-size: $font-size-extrasmall;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 1rem;

        @media (min-width: ($bp-medium)) {
          margin-bottom: 1.5rem;
        }

        @media (min-width: $bp-4k) {
          font-size: 2rem;
          margin-bottom: 4rem;
        }

        em {
          display: block;
          color: $white;
          font-style: normal;
          font-size: $font-size-large;
          font-weight: 700;
          text-transform: none;

          @media (min-width: ($bp-medium)) {
            font-size: 2.25rem;
            line-height: 1.2;
          }

          @media (min-width: $bp-4k) {
            font-size: 6rem;
          }
        }
      }

      ::v-deep p {
        color: $white;
        text-align: left;

        @media (min-width: ($bp-medium)) {
          font-size: $font-size-medium;
        }

        @media (min-width: $bp-4k) {
          font-size: 3.3125rem;
        }
      }

      // before and after for internal border
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 2rem;
        right: 2rem;
        bottom: 0;
        border-left: 1px solid $grey;
        border-right: 1px solid $grey;
        @media (min-width: ($bp-medium)) {
          left: 4rem;
          right: 4rem;
        }

        @media (min-width: ($bp-4k)) {
          left: 8rem;
          right: 8rem;
        }
      }

      &::after {
        content: '';
        position: absolute;
        top: 7.25rem;
        left: 0;
        right: 0;
        bottom: 2rem;
        border-top: 1px solid $grey;
        border-bottom: 1px solid $grey;

        @media (min-width: ($bp-medium)) {
          top: 9.25rem;
          bottom: 4rem;
        }

        @media (min-width: ($bp-4k)) {
          top: 18.625rem;
          bottom: 8rem;
        }
      }
    }

    .hero-background {
      left: 0;
      top: 3.5rem;
      right: 0;
      bottom: 0;
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: $black;

      // overlay to keep image & text contrast
      @media (max-width: $bp-extralarge) {
        &::after {
          content: '';
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(0deg, rgba(25, 24, 23, 0.8), rgba(25, 24, 23, 0.8));
          mix-blend-mode: multiply;
          position: absolute;
        }
      }

      @media (min-width: ($bp-wqhd)) {
        top: 5.125rem;
      }
    }

    #europeana-logo {
      p {
        font-size: $font-size-smallest;

        @media (min-width: ($bp-medium)) {
          font-size: $font-size-extrasmall;
        }

        @media (min-width: ($bp-4k)) {
          font-size: 1.875rem;
        }
      }

      img {
        display: block;
        margin-top: 0.25rem;
        width: 100px;
        filter: invert(1);

        @media (min-width: ($bp-medium)) {
          margin-top: 0.75rem;
          width: 176px;
        }

        @media (min-width: ($bp-4k)) {
          margin-top: 1.5rem;
          width: 440px;
        }
      }
    }
  }
</style>

<docs lang="md">
```jsx
  import '@europeana/style/scss/DS4CH/style.scss';

  <div class="ds4ch-layout">
    <DS4CHLandingHero
      :cta="{ url: '/', text: 'Call to action' }"
      headline="This is an example of <em>a DS4CH hero</em>"
      text="A description what this page is all about"
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
  </div>
```
</docs>
