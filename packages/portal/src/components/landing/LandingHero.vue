<template>
  <div
    class="landing-hero"
    :class="variant"
  >
    <b-container class="d-lg-flex align-items-center">
      <div class="hero-content-wrapper">
        <header class="hero-content">
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
          <div
            v-if="variant === 'ds4ch'"
            id="europeana-logo"
          >
            <h1>
              {{ $t('ds4ch.broughtBy') }}
            </h1>
            <img
              :src="europeanaLogoSrc"
              class="logo-white"
            >
          </div>
        </header>
      </div>
      <ImageWithAttribution
        class="hero-image pl-3 pr-3 mb-5 mb-lg-0 p-lg-0"
        :class="{ 'svg-image': isSVG, variant }"
        :alt="heroImage.image.description || ''"
        :src="heroImage.image.url"
        :content-type="heroImage.image.contentType"
        :attribution="heroImage"
        :image-srcset="isSVG ? null : imageSrcset"
        :image-sizes="isSVG ? null : imageSizes"
        :lazy="false"
        width="auto"
        height="auto"
      />
    </b-container>
  </div>
</template>

<script>
  import ImageWithAttribution from '@/components/image/ImageWithAttribution';
  import SmartLink from '@/components/generic/SmartLink';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  const SRCSET_PRESETS = {
    small: { w: 500 },
    medium: { w: 500 },
    large: { w: 660 },
    xl: { w: 465 },
    xxl: { w: 555 },
    xxxl: { w: 625 },
    wqhd: { w: 625 },
    '4k': { w: 938 }
  };

  const SRCSET_PRESETS_DS4CH = {
    small: { w: 576, h: 896, fit: 'fill' },
    medium: { w: 768, h: 1080, fit: 'fill' },
    large: { w: 992, h: 1080, fit: 'fill' },
    xl: { w: 1200, h: 1080, fit: 'fill' },
    xxl: { w: 1440, h: 1080, fit: 'fill' },
    xxxl: { w: 1920, h: 1080, fit: 'fill' },
    wqhd: { w: 2560, h: 1440, fit: 'fill' },
    '4k': { w: 3840, h: 2160, fit: 'fill' }
  };

  export default {
    name: 'LandingHero',

    components: {
      ImageWithAttribution,
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
      },
      /**
       * Variant to define layout and style
       * @values default, ds4ch
       */
      variant: {
        type: String,
        default: 'default'
      }
    },

    data() {
      return {
        imageSizes: [
          '(max-width: 767px) 500px', // bp-medium
          '(max-width: 991px) 660px', // bp-large
          '(max-width: 1199px) 465px', // bp-xl
          '(max-width: 1399px) 555px', // bp-xxl
          '(max-width: 3019px) 625px', // bp-4k
          '938px'
        ].join(','),
        europeanaLogoSrc: require('@europeana/style/img/logo.svg')
      };
    },

    computed: {
      srcSetPreset() {
        if (this.variant === 'ds4ch') {
          return SRCSET_PRESETS_DS4CH;
        } else {
          return SRCSET_PRESETS;
        }
      },
      imageSrcset() {
        return (
          this.heroImage?.image &&
          this.$contentful.assets.responsiveImageSrcset(
            this.heroImage.image,
            this.srcSetPreset
          )
        );
      },
      isSVG() {
        return this.heroImage.image.contentType === 'image/svg+xml';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-hero {
    background-color: $bodygrey;
    position: relative;

    &.default {
      .container {
        @media (min-width: $bp-xxl) {
          max-width: 1250px;
          padding-left: 0;
          padding-right: 0;
        }

        @media (min-width: $bp-4k) {
          max-width: calc(1.5 * 1250px);
        }
      }
    }
  }

  .hero-content-wrapper {
    background-color: $bodygrey;
    padding: 3rem 1rem 1rem;

    @media (min-width: ($bp-medium + 1px)) {
        width: 65%;
        position: relative;
        z-index: 10;
        padding: 6.25rem 6.25rem 6.25rem 0;
        clip-path: polygon(0% 0%, 100% 0, 100% calc(100% - 209px), calc(100% - 95px) 100%, 0 100%);
    }

    @media (min-width: $bp-large) {
      width: 50%;
      padding: 6.25rem 4rem 6.25rem 0;
    }

    @media (min-width: $bp-4k) {
      padding: calc(1.5 * 6.25rem) calc(1.5 * 6.25rem) calc(1.5 * 6.25rem) 0;
    }
  }

  .hero-content {
    max-width: 443px;

    @media (min-width: $bp-4k) {
      max-width: calc(1.5 * 443px);
    }

    ::v-deep h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      line-height: 1.5;

      @media (min-width: ($bp-medium + 1px)) {
        font-size: 2.875rem;
        line-height: 1.2;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 2.875rem);
        margin-bottom: calc(1.5 * 0.75rem);
      }

      em {
        font-style: normal;
        color: $blue;
      }
    }

    p {
      color: $mediumgrey;
    }
  }

  .hero-image {
    width: 100%;
    position: relative;

    @media (min-width: $bp-large) {
      width: 50%;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';

  #europeana-logo {
    img {
      filter: invert(1);
    }
  }

  .landing-hero.ds4ch {
    background-color: $black;
    overflow: hidden;
    min-height: 100vh;

    &::after {
      content: '';

      position: absolute;
      inset: 2rem;
      top: 5.5rem;
      border: 1px solid $white;
      opacity: 0;
      animation: appear 400ms ease-out 500ms forwards;

      @keyframes appear {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (min-width: ($bp-extralarge)) {
        inset: 4rem;
        top: 7.5rem;
      }

      @media (min-width: ($bp-4k)) {
        inset: 10rem;
        top: 15rem;
        border-width: 2px;
      }
    }

    .container {
      padding-left: 2rem;
      padding-right: 2rem;

      @media (min-width: $bp-large) {
        margin-left: 2rem;
        margin-right: 2rem;
      }

      @media (min-width: ($bp-extralarge)) {
        padding-left: 4rem;
        padding-right: 4rem;
        margin-left: 4rem;
        margin-right: 4rem;
      }

      @media (min-width: ($bp-4k)) {
        padding-left: 10rem;
        padding-right: 10rem;
        margin-left: 10rem;
        margin-right: 10rem;
      }
    }
    .hero-content-wrapper {
      background-color: transparent;
      position: relative;
      z-index: 1;
      height: 100%;
      padding: 13.5rem 3rem 3rem;

      @media (min-width: ($bp-medium)) {
        width: auto;
        padding: 15.8125rem 0 11.25rem;
        clip-path: none;
      }

      @media (min-width: ($bp-4k)) {
        padding: 38rem 0 31rem;
      }
    }

    .hero-content {
      max-width: 591px;
      margin: auto;
      overflow: hidden;

      @media (min-width: ($bp-large)) {
        margin: 0;
      }

      @media (min-width: $bp-4k) {
        max-width: 1573px;
      }

      .hero-content-text-block {
        transform: translateY(100%);
        opacity: 0;
        animation: slide 400ms ease-out 100ms forwards;
        margin-bottom: auto;
        margin-top: auto;

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
        text-align: center;
        font-family: $font-family-montserrat;
        font-size: $font-size-extrasmall;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 7.5rem;

        @media (min-width: ($bp-medium)) {
          margin-bottom: 1.5rem;
        }

        @media (min-width: ($bp-large)) {
          text-align: left;
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
        text-align: center;

        @media (min-width: ($bp-medium)) {
          font-size: $font-size-medium;
        }

        @media (min-width: ($bp-large)) {
          text-align: left;
        }

        @media (min-width: $bp-4k) {
          font-size: 3.3125rem;
        }
      }
    }

    .hero-image {
      width: 100%;
      position: absolute;
      inset: 0;
      margin-left: auto;
      transition: transform 500ms ease-out;

      &::before {
        content: '';
        inset: 0;
        mix-blend-mode: multiply;
        position: absolute;
      }
    }

    ::v-deep .background-attribution {
      .icon-info {
        z-index: 1;
        right: 2.5rem;
        bottom: 2.5rem;
        opacity: 0.5;

        @media (min-width: ($bp-extralarge)) {
          right: 5rem;
          bottom: 5rem;
        }

        @media (min-width: ($bp-4k)) {
          right: 12.625rem;
          bottom: 12.625rem;
          width: 4rem;
          height: 4rem;

          &::before {
            font-size: 4rem;
          }
        }
      }
      .cite-attribution {
        z-index: 1;
        right: 2.5rem;
        bottom: 2.5rem;

        @media (min-width: ($bp-extralarge)) {
          right: 5rem;
          bottom: 5rem;
        }

        @media (min-width: ($bp-4k)) {
          right: 12.625rem;
          bottom: 12.625rem;
        }
      }
    }
  }
</style>

<docs lang="md">
  Variant 'pro'
  ```jsx
    <LandingHero
      headline="This is a <em>landing</em> page"
      text="A description what this page is all about"
      :cta="{
        url: 'https://www.europeana.eu',
        text: 'Go to Pro'
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

  Variant 'ds4ch'
  ```jsx
    <LandingHero
      variant="ds4ch"
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
