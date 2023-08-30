<template>
  <div
    class="info-card"
  >
    <div
      v-if="card.image"
      class="image-wrapper d-flex justify-content-center mb-2"
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
    <h3
      class="title mb-2"
    >
      {{ card.name }}
    </h3>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="card.text"
      class="text"
      v-html="parseMarkdownHtml(card.text)"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCard',

    components: {
      ImageOptimised: () => import('@/components/image/ImageOptimised')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * Info card
       */
      card: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .info-card {
    max-width: 310px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-large) {
      margin-left: 2rem;
      margin-right: 2rem;
    }

    @media (min-width: $bp-4k) {
      max-width: calc(1.5 * 310px);
      margin-left: 3rem;
      margin-right: 3rem;
    }
    .image-wrapper {
      height: 80px;

      @media (min-width: $bp-large) {
        height: 111px;
      }
    }

    .image {
      max-height: 100%;
      margin: auto auto 0 auto;
    }

    .title {
      color: $mediumgrey;
      font-family: $font-family-ubuntu;
      font-weight: 500;
      text-transform: uppercase;
    }

    .text {
      font-weight: 500;
      color: $mediumgrey;
      margin-bottom: 2rem;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingInfoCard
      :card="{
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        }
    }"
    />
  ```
</docs>
