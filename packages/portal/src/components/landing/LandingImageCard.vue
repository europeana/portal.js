<template>
  <div
    class="image-card d-lg-flex mx-auto"
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
      <h3 class="title mb-2 mb-lg-3">
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
        class="btn btn-cta btn-primary"
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
    small: { w: 545, h: 270, fit: 'fill' },
    medium: { w: 510, h: 306, fit: 'fill' },
    large: { w: 510, h: 306, fit: 'fill' },
    xl: { w: 570, h: 342, fit: 'fill' },
    xxl: { w: 612, h: 367, fit: 'fill' },
    xxxl: { w: 612, h: 367, fit: 'fill' },
    wqhd: { w: 612, h: 367, fit: 'fill' },
    '4k': { w: 918, h: 551, fit: 'fill' }
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
      }
    },

    data() {
      return {
        imageSizes: [
          '(max-width: 575px) 545px', // bp-small
          '(max-width: 991px) 510px', // bp-large
          '(max-width: 1199px) 570px', // bp-xl
          '(max-width: 3019px) 612px', // bp-4k
          '918px'
        ].join(',')
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

    @media (min-width: $bp-medium) {
      max-width: 510px;
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
      @media (min-width: $bp-large) {
        flex: 0 0 49%;
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
      height: 100%;

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

      @media (min-width: $bp-medium) {
        font-size: 1.75rem;
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
