<template>
  <div
    class="landing-hero"
  >
    <b-container class="d-lg-flex align-items-center">
      <div class="hero-content-wrapper">
        <header class="hero-content">
          <!-- eslint-disable vue/no-v-html -->
          <div
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
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="ctaHelpText"
            class="btn-cta-helptext form-text text-muted mt-3"
            v-html="parseMarkdownHtml(ctaHelpText)"
          />
          <!-- eslint-enable vue/no-v-html -->
        </header>
      </div>
      <ImageWithAttribution
        v-if="heroImage?.image"
        class="hero-image px-sm-3 mb-4 mb-lg-0 p-lg-0"
        :class="{ 'svg-image': isSVG }"
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
    medium: { w: 500 },
    large: { w: 660 },
    xl: { w: 465 },
    xxl: { w: 555 },
    '4k': { w: 625 },
    '4k+': { w: 938 }
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
      ctaHelpText: {
        type: String,
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
        imageSizes: [
          '(max-width: 767px) 500px', // bp-medium
          '(max-width: 991px) 660px', // bp-large
          '(max-width: 1199px) 465px', // bp-xl
          '(max-width: 1399px) 555px', // bp-xxl
          '(max-width: 3019px) 625px', // bp-4k
          '938px'
        ].join(',')
      };
    },

    computed: {
      imageSrcset() {
        return (
          this.heroImage?.image &&
          this.$contentful.assets.responsiveImageSrcset(
            this.heroImage.image,
            SRCSET_PRESETS
          )
        );
      },
      isSVG() {
        return this.heroImage?.image?.contentType === 'image/svg+xml';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-hero {
    background-color: $bodygrey;
    position: relative;

    .container {
      @media (min-width: $bp-xxl) {
        max-width: 1250px;
        padding-left: 0;
        padding-right: 0;
      }

      @media (min-width: $bp-4k) {
        max-width: 2500px;
      }
    }
  }

  .hero-content-wrapper {
    background-color: $bodygrey;
    padding: 3rem 1rem 1rem;

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
      max-width: calc(2 * 443px);
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
        font-size: 6rem;
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

    .btn-cta-helptext {

      @media (min-width: $bp-4k) {
        font-size: $font-size-large;
        margin-top: 2rem !important;
      }

      ::v-deep p {
        margin-bottom: 0;
      }

      ::v-deep a {
        color: $mediumgrey;
      }
    }
  }

  .hero-image {
    width: 100%;
    position: relative;

    @media (min-width: $bp-large) {
      width: 50%;
    }

    ::v-deep img {
      margin-bottom: 2rem;

      @media (min-width: $bp-large) {
        margin-top: 2rem;
      }
    }
  }
</style>

<docs lang="md">
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
          contentType: 'image/svg+xml',
          description: null,
          height: 2694,
          url: illustrations.audience,
          width: 4320
        }
      }"
    />
  ```
</docs>
