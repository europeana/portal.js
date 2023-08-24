<template>
  <div class="image-card-group">
    <div class="header pt-5 pb-5">
      <b-container>
        <div class="header-content text-center mx-auto">
          <h2>
            {{ title }}
          </h2>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="text"
            class="mb-3"
            v-html="parseMarkdownHtml(text)"
          />
        <!-- eslint-enable vue/no-v-html -->
        </div>
      </b-container>
    </div>
    <b-container>
      <div
        v-if="imageCards.length"
      >
        <LandingImageCard
          v-for="(card, index) in imageCards"
          :key="index"
          :card="card"
        />
      </div>
    </b-container>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingImageCardGroup',
    components: {
      LandingImageCard: () => import('@/components/landing/LandingImageCard')
    },

    mixins: [parseMarkdownHtmlMixin],

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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .image-card-group {
    background-color: $bodygrey;
    border-bottom: 1px solid $bodygrey;
  }

  .header {
    background-color: $blue;
    color: $white;
    margin-bottom: 2.5rem;

    @media (min-width: $bp-large) {
      margin-bottom: 4.625rem;
    }
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
