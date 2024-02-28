<template>
  <div
    ref="imagecard"
    class="image-card d-lg-flex"
    :class="variant"
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
        :image-sizes="isSVG ? null : imageSizes"
      />
    </div>
    <div class="text-wrapper">
      <h3 class="title">
        {{ card.name }}
      </h3>
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
        class="btn btn-secondary icon-chevron"
        hide-external-icon
      >
        {{ card.link.text }}
      </SmartLink>
    </div>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  const SRCSET_PRESETS = {
    small: { w: 512, fit: 'fill' },
    medium: { w: 510, fit: 'fill' },
    large: { w: 690, fit: 'fill' },
    xl: { w: 600, fit: 'fill' },
    xxl: { w: 700, fit: 'fill' },
    xxxl: { w: 940, fit: 'fill' },
    wqhd: { w: 1500, fit: 'fill' },
    '4k': { w: 1500, fit: 'fill' }
  };

  export default {
    name: 'LandingImageCard',
    components: {
      ImageWithAttribution: () => import('@/components/image/ImageWithAttribution'),
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [parseMarkdownHtmlMixin],

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
      }
    },

    data() {
      return {
        imageSizes: [
          '(max-width: 575px) 512px', // bp-small
          '(max-width: 767px) 510px', // bp-medium
          '(max-width: 991px) 690px', // bp-large
          '(max-width: 1199px) 600px', // bp-xl
          '(max-width: 1399px) 700px', // bp-xxl
          '(max-width: 1879px) 940px', // bp-xxxl
          '(max-width: 2519px) 1500px', // bp-wqhd
          '(max-width: 3019px) 1500px', // bp-4k
          '1500px'
        ].join(','),
        imageCardIndex: -1
      };
    },

    computed: {
      cardImageWithAttribution() {
        return this.card.image;
      },
      isSVG() {
        return this.cardImageWithAttribution.image.contentType === 'image/svg+xml';
      }
    },

    mounted() {
      this.imageCardIndex = [...document.querySelectorAll('.image-card')].indexOf(this.$refs?.imagecard);
    },

    methods: {
      imageSrcset(image) {
        return this.$contentful.assets.responsiveImageSrcset(image, SRCSET_PRESETS);
      }
    }
  };
  </script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .image-card {
    margin-bottom: 2.375rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-medium) {
      align-items: flex-end;
    }

    @media (min-width: $bp-large) {
      max-width: 1250px;
      margin-bottom: 8rem;

      &:nth-child(even) {
        .text-wrapper {
          order: -1;
          padding-right: 3.625rem;
          padding-left: 2rem;

          @media (min-width: $bp-extralarge) {
            padding-left: 6rem;
          }
        }
      }
    }

    @media (min-width: $bp-4k) {
      max-width: calc(1.5 * 1250px);
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
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background-color: $white;
        padding-left: 3.625rem;
        padding-right: 2rem;
      }

      @media (min-width: $bp-extralarge) {
        padding-right: 6rem;
      }

      @media (min-width: $bp-xxl) {
        padding-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        padding-bottom: 3rem;
      }
    }

    ::v-deep figure {
      margin: 0;
      height: 306px;
      width: 100%;

      @media (min-width: $bp-large) {
        height: 367px;
      }

      @media (min-width: $bp-4k) {
        height: 551px;
      }

      img {
        height: 100%;
      }
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
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;
      margin-bottom: 0.5rem;

      @media (min-width: $bp-medium) {
        font-size: 1.75rem;
      }

      @media (min-width: $bp-large) {
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.75rem);
      }
    }

    .text {
      color: $mediumgrey;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';
  .ds4ch.image-card {
    max-width: none;
    text-align: center;

    @media (min-width: $bp-large) {
      text-align: left;
      align-items: center;
    }

    .image-wrapper {
      @media (min-width: $bp-large) {
        max-width: none;
      }

      ::v-deep figure {
        height: 306px;

        @media (min-width: $bp-medium) {
          height: 367px;
        }

        @media (min-width: $bp-xxl) {
          height: 436px;
        }

        @media (min-width: $bp-4k) {
          height: 908px;
        }
      }
    }
    .text-wrapper {
      padding-right: 0;
      display: block;

      @media (min-width: $bp-4k) {
        padding-left: 12rem;
      }

      .title {
        text-align: center;

        @media (min-width: $bp-large) {
          text-align: left;
        }
      }

      h3.title {
        @extend %title-3;
      }

      .text {
        color: $black;
        text-align: left;
      }

      .btn {
        margin-top: 1rem;

        @media (min-width: $bp-4k) {
          margin-top: 3rem;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
      <LandingImageCard
        :card="{
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0]
        }"
      />
  ```
</docs>
