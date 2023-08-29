<template>
  <div
    class="info-card"
    :class="variant"
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
      v-if="card.name && showTitle"
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
      },
      variant: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        showTitle: this.variant !== 'logo'
      };
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

    &.logo {
      flex-basis: calc(50% - 2rem);
      margin: 0 1rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (min-width: $bp-small) {
        flex-basis: calc(25% - 2rem);
      }

      @media (min-width: $bp-large) {
        margin: 0 1.5rem 1rem;
        flex-basis: 127px;

      }

      @media (min-width: $bp-4k) {
        margin: 0 2rem 1rem;
        flex-basis: calc(1.5 * 127px);
      }

      .image-wrapper {
        height: auto;
        width: 100%;
        max-width: 127px;

        @media (min-width: $bp-4k) {
          max-width: calc(1.5 * 127px);
        }

        img {
          width: 100%;
          filter: grayscale(1);
          opacity: 0.8
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingInfoCard
      :card="{
        __typename: 'InfoCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }"
    />
  ```
</docs>
