<template>
  <div class="image-card-group">
    <div class="header pt-5 pb-5">
      <b-container>
        <b-col class="header-content col-lg-8 text-center mx-auto">
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
        </b-col>
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

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }
  }

  .header-content {
    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingImageCardGroup
      title="This is a title for an image card group"
      text="A __description__ what this section is all about"
      :image-cards="[{
        __typename: 'ImageCard',
        name: 'Card title',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          name: 'Eight plants, including two orchids, a crocus and some tulips: flowering stems. Coloured etching, c.1837.',
          creator: null,
          provider: 'Wellcome Collection',
          license: 'http://creativecommons.org/licenses/by/4.0/',
          url: 'http://data.europeana.eu/item/9200579/hxf3z8ek',
          image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1l8m0GQ9crP6zvts5zWYos/0006db953cc9a8a08a064c141cd78777/feature_botanical-illustrations.jpg',
          contentType: 'image/jpeg',
          description: 'colour illustration of a bunch of colourful flowers in yellow, red, orange',
          width: 830, height: 470 }
        }
      }, {
        __typename: 'ImageCard',
        name: 'Card title',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          name: 'Eight plants, including two orchids, a crocus and some tulips: flowering stems. Coloured etching, c.1837.',
          creator: null,
          provider: 'Wellcome Collection',
          license: 'http://creativecommons.org/licenses/by/4.0/',
          url: 'http://data.europeana.eu/item/9200579/hxf3z8ek',
          image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1l8m0GQ9crP6zvts5zWYos/0006db953cc9a8a08a064c141cd78777/feature_botanical-illustrations.jpg',
          contentType: 'image/jpeg',
          description: 'colour illustration of a bunch of colourful flowers in yellow, red, orange',
          width: 830, height: 470 }
        }
      }, {
        __typename: 'ImageCard',
        name: 'Card title',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          name: 'Eight plants, including two orchids, a crocus and some tulips: flowering stems. Coloured etching, c.1837.',
          creator: null,
          provider: 'Wellcome Collection',
          license: 'http://creativecommons.org/licenses/by/4.0/',
          url: 'http://data.europeana.eu/item/9200579/hxf3z8ek',
          image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1l8m0GQ9crP6zvts5zWYos/0006db953cc9a8a08a064c141cd78777/feature_botanical-illustrations.jpg',
          contentType: 'image/jpeg',
          description: 'colour illustration of a bunch of colourful flowers in yellow, red, orange',
          width: 830, height: 470 }
        }
      }]"
    />
  ```
</docs>
