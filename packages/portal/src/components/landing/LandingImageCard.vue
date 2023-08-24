<template>
  <div
    class="image-card"
  >
    <div
      v-if="card.image"
      class="image-wrapper d-flex flex-end justify-content-center mb-2"
    >
      <ImageOptimised
        class="image"
        :alt="card.image.description"
        :src="card.image.url"
        :width="card.image.width"
        :height="card.image.height"
        :content-type="card.image.contentType"
        :max-width="1100"
        :lazy="true"
      />
    </div>
    <h3 class="title mb-2">
      {{ card.name }}
    </h3>
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="text"
      v-html="html(card.text)"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
  // TODO: Replace with mixin
  import { marked } from 'marked';

  export default {
    name: 'LandingImageCard',
    components: {
      ImageOptimised: () => import('@/components/image/ImageOptimised')
    },

    props: {
      /**
       * Image card
       */
      card: {
        type: Object,
        default: null
      }
    },

    methods: {
      // TODO: Replace with mixin
      html(text) {
        return text ? marked.parse(text) : text;
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
