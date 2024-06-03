<template>
  <div
    ref="imagecard"
    class="image-card d-lg-flex justify-content-center"
    :class="[variant, cardClasses, parityClasses]"
  >
    <div
      v-if="cardImageWithAttribution && cardImageWithAttribution.image"
      class="image-wrapper d-lg-flex align-items-end"
    >
      <ImageWithAttribution
        class="image"
        :class="{ 'svg-image': isSVG }"
        :alt="cardImageWithAttribution.image.description || ''"
        :src="cardImageWithAttribution.image.url"
        :width="612"
        :height="365"
        :content-type="cardImageWithAttribution.image.contentType"
        :attribution="cardImageWithAttribution"
        :image-srcset="isSVG ? null : imageSrcset(cardImageWithAttribution.image)"
        :image-sizes="isSVG ? null : sizesPresets"
      />
    </div>
    <div class="text-wrapper">
      <component
        :is="titleTag"
        class="title"
      >
        {{ card.name }}
      </component>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="text"
        v-html="parseMarkdownHtml(card.text)"
      />
      <!-- eslint-enable vue/no-v-html -->
      <SmartLink
        v-if="card.link"
        :destination="card.link.url"
        data-qa="call to action"
        class="btn"
        :class="{
          'btn-secondary icon-chevron': variant === 'ds4ch',
          'btn-outline-primary': variant !== 'ds4ch'
        }"
        hide-external-icon
      >
        {{ card.link.text }}
      </SmartLink>
    </div>
  </div>
</template>

<script>
  import parityMixin from '@/mixins/parity.js';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import { responsiveContentfulImageSrcset } from '@/utils/contentful/assets.js';

  const SRCSET_PRESETS = {
    small: { w: 512, h: 342, fit: 'fill' },
    medium: { w: 510, h: 340, fit: 'fill' },
    large: { w: 690, h: 460, fit: 'fill' },
    xl: { w: 465, h: 310, fit: 'fill' },
    '4k': { w: 625, h: 417, fit: 'fill' },
    '4k+': { w: 1225, h: 700, fit: 'fill' }
  };

  const SIZES_PRESETS = [
    '(max-width: 575px) 512px', // bp-small
    '(max-width: 767px) 510px', // bp-medium
    '(max-width: 991px) 690px', // bp-large
    '(max-width: 1199px) 465px', // bp-xl
    '(max-width: 3019px) 625px', // bp-4k
    '1225px'
  ].join(',');

  const SRCSET_PRESETS_DS4CH = {
    small: { w: 512, h: 342, fit: 'fill' },
    medium: { w: 510, h: 340, fit: 'fill' },
    large: { w: 690, h: 460, fit: 'fill' },
    xl: { w: 600, h: 400, fit: 'fill' },
    xxl: { w: 700, h: 467, fit: 'fill' },
    '4k': { w: 625, h: 417, fit: 'fill' },
    '4k+': { w: 1500, h: 1000, fit: 'fill' }
  };

  const SIZES_PRESETS_DS4CH = [
    '(max-width: 575px) 512px', // bp-small
    '(max-width: 767px) 510px', // bp-medium
    '(max-width: 991px) 690px', // bp-large
    '(max-width: 1199px) 600px', // bp-xl
    '(max-width: 1399px) 700px', // bp-xxl
    '(max-width: 3019px) 625px', // bp-4k
    '1500px'
  ].join(',');

  export default {
    name: 'LandingImageCard',
    components: {
      ImageWithAttribution: () => import('@/components/image/ImageWithAttribution'),
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [
      parityMixin,
      parseMarkdownHtmlMixin
    ],

    props: {
      /**
       * Image card
       */
      card: {
        type: Object,
        default: null
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      }
    },

    data() {
      return {
        cardClasses: this.card?.profile?.background ? `bg-color-${this.card.profile.background}` : '',
        cardImageWithAttribution: this.card?.image,
        isSVG: this.card?.image?.image?.contentType === 'image/svg+xml',
        sizesPresets: this.variant === 'ds4ch' ? SIZES_PRESETS_DS4CH : SIZES_PRESETS,
        srcSetPresets: this.variant === 'ds4ch' ? SRCSET_PRESETS_DS4CH : SRCSET_PRESETS
      };
    },

    mounted() {
      this.$nextTick(() => this.markParity('image-card', 'imagecard'));
    },

    methods: {
      imageSrcset(image) {
        return responsiveContentfulImageSrcset(image, this.srcSetPresets, this.card?.profile);
      }
    }
  };
  </script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .image-card {
    margin-bottom: 3rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    @media (min-width: $bp-medium) {
      align-items: center;
    }

    @media (min-width: $bp-large) {
      text-align: left;
      max-width: 1250px;
      margin-bottom: 6rem;

      &:nth-child(even),
      &.image-card-even {
        .text-wrapper {
          order: -1;
          padding-right: 3.625rem;
          padding-left: 2rem;

          @media (min-width: $bp-extralarge) {
            padding-left: 6rem;
          }

          @media (min-width: $bp-4k) {
            padding-right: 6rem;
          }
        }
      }
    }

    @media (min-width: $bp-4k) {
      max-width: 2500px;
      margin-bottom: 15rem;
    }

    .image-wrapper {
      margin-bottom: 1rem;

      @media (min-width: $bp-large) {
        flex: 0 0 49%;
        margin-bottom: 0;
      }
    }

    .text-wrapper {
      @media (min-width: $bp-large) {
        flex: 0 0 51%;
        background-color: $white;
        padding-left: 3.625rem;
        padding-right: 2rem;
      }

      @media (min-width: $bp-extralarge) {
        padding-right: 6rem;
      }

      @media (min-width: $bp-4k) {
        padding-left: 6rem;
      }
    }

    &.bg-color-alternate,
    .image-card-container-wrapper &.bg-color-alternate {
      background-color: $bodygrey;
      margin-top: 0;
      margin-bottom: 0;

      padding-top: 3rem;
      padding-bottom: 3rem;

      @media (min-width: $bp-large) {
        padding-top: 6rem;
        padding-bottom: 6rem;
      }

      @media (min-width: $bp-4k) {
        padding-top: 15rem;
        padding-bottom: 15rem;
      }

      .text-wrapper {
        background-color: $bodygrey;
      }
    }

    ::v-deep figure {
      margin: 0;
      width: 100%;
      height: auto;
    }

    figure.svg-image {
      width: 100%;
      height: auto;

      ::v-deep img {
        width: 100%;
        height: auto;
      }
    }

    .title {
      text-align: center;

      @media (min-width: $bp-large) {
        text-align: left;
      }
    }

    .text {
      color: $mediumgrey;
      text-align: left;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .ds4ch.image-card {
    max-width: 100%;

    @media (min-width: $bp-large) {
      padding-right: 0;
    }

    .image-wrapper {
      @media (min-width: $bp-large) {
        max-width: none;
      }

      @media (min-width: $bp-xxl) {
        flex-basis: 625px;
      }

      @media (min-width: $bp-4k) {
        flex-basis: 1500px;
      }

    }

    .text-wrapper {
      padding-right: 0;

      @media (min-width: $bp-large) {
        padding-right: 2rem;
      }

      @media (min-width: $bp-extralarge) {
        padding-right: 6rem;
      }

      @media (min-width: $bp-xxl) {
        flex-basis: 625px;
        padding-right: 0;
      }

      @media (min-width: $bp-xxl) {
        flex-basis: 625px;
      }

      @media (min-width: $bp-4k) {
        padding-right: 4rem;
        padding-left: 12rem;
        flex-basis: 1500px;
      }

      .text {
        color: $black;

        @media(min-width: $bp-4k) {
          font-size: 2.5rem;
        }
      }

      .btn {
        margin-top: 1rem;

        @media (min-width: $bp-4k) {
          margin-top: 3rem;
        }
      }
    }

    &:nth-child(even),
    &.image-card-even {
      .text-wrapper {
        @media (min-width: $bp-large) {
          order: -1;
          padding-right: 3.625rem;
          padding-left: 2rem;
        }

        @media (min-width: $bp-extralarge) {
          padding-left: 6rem;
        }
        @media (min-width: $bp-xxl) {
          padding-right: 6rem;
          padding-left: 0;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <div class="landing-page xxl-page">
      <LandingImageCard
        :card="{
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0]
        }"
      />
      <LandingImageCard
        :card="{
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0],
          link: { text: 'read more', url: '/'}
        }"
      />
    </div>
  ```
</docs>
