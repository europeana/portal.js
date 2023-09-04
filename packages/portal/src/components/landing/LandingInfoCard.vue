<template>
  <div
    class="info-card d-inline-flex flex-wrap flex-lg-nowrap"
  >
    <div
      v-if="card.image"
      class="image-wrapper mx-auto"
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
    <div class="ml-lg-3">
      <h3
        class="title mb-2 text-center text-lg-left"
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
    margin-bottom: 1rem;

    @media (min-width: $bp-large) {
      flex: 0 1 calc(50% - 2rem);
      padding-bottom: 3rem;
      margin-bottom: 2rem;
    }

    @media (min-width: $bp-extralarge) {
      flex: 0 1 50%;
      padding: 0 2rem 3rem;
    }

    @media (min-width: $bp-xxxl) {
      flex: 0 1 50%;
      padding: 0 4rem 3rem;
    }

    @media (min-width: $bp-wqhd) {
      flex: 0 1 25%;
    }

    .image-wrapper {
      flex: 0 0 100%;
      max-width: 80px;

      @media (min-width: $bp-large) {
        flex: 0 0 80px;
      }

      @media (min-width: $bp-4k) {
        flex: 0 0 calc(1.5 * 80px);
      }

      img {
        width: 100%;
      }
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
