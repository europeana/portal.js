<template>
  <div
    class="image-card d-lg-flex mx-auto"
  >
    <div
      v-if="cardImageWithAttribution"
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
        return this.$contentful.assets.responsiveImageSrcset(image,
                                                             {
                                                               small: { w: 545, h: 270, fit: 'fill' },
                                                               medium: { w: 510, h: 306, fit: 'fill' },
                                                               large: { w: 510, h: 306, fit: 'fill' },
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
