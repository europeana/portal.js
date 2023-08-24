<template>
  <div>
    <div class="header pt-5 pb-5">
      <b-container class="text-center">
        <div class="header-content mx-auto">
          <h2>
            {{ title }}
          </h2>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="text"
            class="mb-3"
            v-html="html(text)"
          />
        <!-- eslint-enable vue/no-v-html -->
        </div>
      </b-container>
    </div>
    <!-- <b-container class="text-center">
      <div
        v-if="imageCards.length"
      >
        <LandingImageCard
          v-for="(card, index) in imageCards"
          :key="index"
          class="image-card"
          :card="card"
        />
      </div>
    </b-container> -->
  </div>
</template>

<script>
  // TODO: Replace with mixin
  import { marked } from 'marked';

  export default {
    name: 'LandingImageCardGroup',
    components: {
      // LandingImageCard: () => import('@/components/landing/LandingImageCard')
    },

    props: {
      /**
       * H2 title to display above the image cards
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Text to display under title and above the image cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of image cards
       */
      imageCards: {
        type: Array,
        default: () => []
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

.header {
  background-color: $blue;
  color: $white;
}

.header-content {
  max-width: $max-text-column-width;
}
</style>

<docs lang="md">
  ```jsx
    <LandingImageCardGroup
      title="This is a title for an image card group"
      text="A __description__ what this section is all about"
      :image-cards="[ {
        __typename: 'ImageCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }, {
      __typename: 'ImageCard',
    name: 'Usage statistics',
      text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    },
      {
        __typename: 'ImageCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      } ]"
    />
  ```
</docs>
