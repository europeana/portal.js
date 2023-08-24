<template>
  <div
    class="image-card"
  >
    <div
      v-if="cardImageWithAttribution"
      class="image-wrapper d-flex flex-end justify-content-center mb-2"
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
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

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
          '(max-width: 575px) 545px',
          '(max-width: 767px) 360px',
          '(max-width: 991px) 480px',
          '(max-width: 1199px) 570px',
          '(max-width: 3839px) 612px',
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
        return this.$contentful.assets.responsiveImageSrcset(image,
                                                             {
                                                               small: { w: 545, h: 270, fit: 'fill' },
                                                               medium: { w: 360, h: 216, fit: 'fill' },
                                                               large: { w: 480, h: 288, fit: 'fill' },
                                                               xl: { w: 570, h: 342, fit: 'fill' },
                                                               xxl: { w: 612, h: 367, fit: 'fill' },
                                                               xxxl: { w: 612, h: 367, fit: 'fill' },
                                                               wqhd: { w: 612, h: 367, fit: 'fill' },
                                                               '4k': { w: 918, h: 551, fit: 'fill' }
                                                             });
      }
    }
  };
  </script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
// .image-card {
//   max-width: 310px;
//   margin-left: auto;
//   margin-right: auto;
//   @media (min-width: $bp-large) {
//     margin-left: 2rem;
//     margin-right: 2rem;
//   }
//   @media (min-width: $bp-4k) {
//     max-width: calc(1.5 * 310px);
//     margin-left: 3rem;
//     margin-right: 3rem;
//   }
//   .image-wrapper {
//     height: 80px;
//     @media (min-width: $bp-large) {
//       height: 111px;
//     }
//   }
//   .image {
//     max-height: 100%;
//     margin: auto auto 0 auto;
//   }
//   .title {
//     color: $mediumgrey;
//     font-family: $font-family-ubuntu;
//     font-weight: 500;
//     text-transform: uppercase;
//   }
//   .text {
//     font-weight: 500;
//     color: $mediumgrey;
//     margin-bottom: 2rem;
//   }
// }
</style>

<docs lang="md">
  ```jsx
    <LandingImageCard
      :card="{
        __typename: 'ImageCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }"
    />
  ```
</docs>
