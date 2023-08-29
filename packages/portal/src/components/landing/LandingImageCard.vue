<template>
  <div
    class="image-card d-lg-flex mx-auto"
  >
    <div
      v-if="cardImageWithAttribution && cardImageWithAttribution.image"
      class="image-wrapper mb-3 mb-lg-0"
    >
      <ImageWithAttribution
        class="image"
        :alt="cardImageWithAttribution.image.description"
        :src="cardImageWithAttribution.image.url"
        :width="612"
        :height="365"
        :content-type="cardImageWithAttribution.image.contentType"
        :attribution="cardImageWithAttribution"
        :image-srcset="imageSrcset(cardImageWithAttribution.image)"
        :image-sizes="imageSizes"
      />
    </div>
    <div class="text-wrapper">
      <h3 class="title mb-2">
        {{ card.name }}
      </h3>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="text"
        v-html="parseMarkdownHtml(card.text)"
      />
    <!-- eslint-enable vue/no-v-html -->
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
      ImageWithAttribution: () => import('@/components/image/ImageWithAttribution')
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
    }

    @media (min-width: $bp-large) {
      max-width: 1250px;
      margin-bottom: 4.625rem;

      &:nth-child(even) {
        .text-wrapper {
          order: -1;
          padding: 5rem 3.625rem 5rem 6rem;
          clip-path: polygon(95px 0, 100% 0, 100% 100%, 0 100%, 0 calc(100% - 209px));
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
        justify-content: center;
        background-color: $white;
        padding: 5rem 6rem 5rem 3.625rem;
        clip-path: polygon(0% 0%, calc(100% - 95px) 0, 100% calc(100% - 209px), 100% 100%, 0 100%);
      }
    }

    ::v-deep figure {
      margin: 0;
      height: 100%;

      img {
        height: 100%;
      }
    }

    .title {
      font-size: $font-size-base;
      font-family: $font-family-ubuntu;
      font-weight: 700;

      @media (min-width: $bp-medium) {
        font-size: $font-size-large;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-large-4k;
      }
    }

    .text {
      color: $mediumgrey;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <LandingImageCard
        :card="{
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: {
            name: 'Eight plants, including two orchids, a crocus and some tulips: flowering stems. Coloured etching, c.1837.',
            creator: 'Undefined',
            provider: 'Wellcome Collection',
            license: 'http://creativecommons.org/licenses/by/4.0/',
            url: 'http://data.europeana.eu/item/9200579/hxf3z8ek',
            image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1l8m0GQ9crP6zvts5zWYos/0006db953cc9a8a08a064c141cd78777/feature_botanical-illustrations.jpg',
            contentType: 'image/jpeg',
            description: 'colour illustration of a bunch of colourful flowers in yellow, red, orange',
            width: 830, height: 470 }
          }
        }"
      />
    </div>
  ```
</docs>
