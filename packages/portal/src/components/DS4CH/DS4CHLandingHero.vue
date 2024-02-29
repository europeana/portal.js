<template>
  <div class="landing-hero">
    <div
      ref="heroBackground"
      class="hero-background responsive-backround-image"
      :style="imageCSSVars"
    />
    <b-container class="hero-grid d-flex">
      <b-row
        class="hero-top mb-auto"
        align-v="start"
      >
        <b-col class="hero-left" />
        <b-col class="hero-center" />
        <b-col class="hero-right" />
      </b-row>
      <b-row
        class="hero-content flex-fill"
        align-v="stretch"
      >
        <b-col class="hero-left" />
        <b-col
          class="hero-center d-flex"
        >
          <header class="mt-auto mb-auto">
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="hero-content-text-block"
              v-html="parseMarkdownHtml(`# ${headline}\n${text}`)"
            />
            <!-- eslint-enable vue/no-v-html -->
            <SmartLink
              v-if="cta"
              :destination="cta.url"
              class="btn btn-cta btn-primary d-inline-flex align-items-center mt-1 mt-md-4 mb-0"
            >
              {{ cta.text }}
            </SmartLink>
          </header>
          <div
            id="europeana-logo"
            class="mt-auto"
          >
            <h1>
              {{ $t('ds4ch.broughtBy') }}
            </h1>
            <img
              :src="europeanaLogoSrc"
              class="logo-white"
            >
          </div>
        </b-col>
        <b-col class="hero-right" />
      </b-row>
      <b-row
        class="hero-bottom mt-auto"
        align-v="end"
      >
        <b-col class="hero-left" />
        <b-col class="hero-center" />
        <b-col class="hero-right" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  const SRCSET_PRESETS = {
    small: { w: 576, h: 896, fit: 'fill', q: 100, f: 'right' },
    medium: { w: 768, h: 1080, fit: 'fill', q: 100, f: 'right' },
    large: { w: 992, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xl: { w: 1200, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xxl: { w: 1440, h: 1080, fit: 'fill', q: 100, f: 'right' },
    xxxl: { w: 1920, h: 1080, fit: 'fill', q: 100, f: 'right' },
    wqhd: { w: 2560, h: 1440, fit: 'fill', q: 100, f: 'right' },
    '4k': { w: 3840, h: 2160, fit: 'fill', q: 100, f: 'right' }
  };

  export default {
    name: 'LandingHero',

    components: {
      SmartLink
    },

    mixins: [parseMarkdownHtmlMixin],

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
       * Image used as a partial background with attribution.
       * Gets a blue overlay
       */
      heroImage: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        europeanaLogoSrc: require('@europeana/style/img/logo.svg')
      };
    },

    computed: {
      imageCSSVars() {
        return this.heroImage?.image &&
          this.$contentful.assets.responsiveBackgroundImageCSSVars(
            this.heroImage.image,
            SRCSET_PRESETS
          );
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';
  @import '@europeana/style/scss/responsive-background-image';

  #europeana-logo {
    img {
      filter: invert(1);

      @media (min-width: ($bp-4k)) {
        min-width: 17rem;
      }
    }
  }

  .landing-hero {
    overflow: hidden;
    height: 100vh;
    min-height: 37rem;
    position: relative;

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

    .hero-grid {
      left: 0;
      top: 3.5rem;
      right: 0;
      bottom: 0;
      position: absolute;
      margin: 0;
      padding: 0;
      max-width: 100%;
      flex-direction: column;

      .row {
        // override negative margin from "row"
        margin-right: 0;
        margin-left: 0;
      }
      .col {
        min-height: 2rem;
        @media (min-width: ($bp-medium)) {
          min-height: 4rem;
        }

        @media (min-width: ($bp-wqhd)) {
          min-height: 8rem;
        }
      }
    }

    .hero-top {
      padding: 0;
      min-height: 2rem;
      border-bottom: 1px solid $grey;

      @media (min-width: ($bp-medium)) {
        min-height: 4rem;
      }

      @media (min-width: ($bp-wqhd)) {
        min-height: 8rem;
      }
    }
    .hero-bottom {
      padding: 0;
      min-height: 2rem;
      border-top: 1px solid $grey;

      @media (min-width: ($bp-medium)) {
        min-height: 4rem;
      }

      @media (min-width: ($bp-wqhd)) {
        min-height: 8rem;
      }
    }

    .hero-left {
      padding: 0;
      max-width: 2rem;
      border-right: 1px solid $grey;

      @media (min-width: ($bp-medium)) {
        max-width: 4rem;
      }

      @media (min-width: ($bp-wqhd)) {
        max-width: 8rem;
      }
    }
    .hero-right {
      padding: 0;
      max-width: 2rem;
      border-left: 1px solid $grey;

      @media (min-width: ($bp-medium)) {
        max-width: 4rem;
      }

      @media (min-width: ($bp-wqhd)) {
        max-width: 8rem;
      }
    }

    .hero-content {

      .hero-center {
        flex-direction: column;
        padding: 2rem;
        @media (min-width: ($bp-medium)) {
          padding: 4rem;
        }

        @media (min-width: ($bp-wqhd)) {
          padding: 6rem 8rem;
        }
      }
      .hero-content-text-block {
        transform: translateY(100%);
        opacity: 0;
        animation: slide 400ms ease-out 100ms forwards;
        margin-bottom: auto;
        margin-top: auto;
        max-width: 70%;

        @media (min-width: ($bp-large)) {
          max-width: 36rem;
        }
        @media (min-width: ($bp-4k)) {
          max-width: 72rem;
        }

        @keyframes slide {
          from {
            opacity: 1;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }

      ::v-deep h1 {
        color: $white;
        text-align: left;
        font-family: $font-family-montserrat;
        font-size: $font-size-extrasmall;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.6px;
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
          letter-spacing: -0.48px;

          @media (min-width: ($bp-medium)) {
            font-size: 2.25rem;
            line-height: 1.2;
            letter-spacing: normal;
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
    }

    .hero-background {
      left: 0;
      top: 3.5rem;
      right: 0;
      bottom: 0;
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;
      transition: transform 500ms ease-out;
      background-color: $black;

      @media (max-width: $bp-large) or ((max-width: $bp-extralarge) and (orientation: portrait)) {
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
      }
    }
  }
</style>

<docs lang="md">
```jsx
    <DS4CHLandingHero
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
```
</docs>
