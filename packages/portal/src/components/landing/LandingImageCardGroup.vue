<template>
  <div
    class="image-card-group"
    :class="backgroundImageClasses"
  >
    <div
      class="header"
      :class="backgroundImageClasses"
    >
      <b-container>
        <b-col class="header-content col-lg-8 px-0 text-center mx-auto">
          <h2>
            {{ title }}
          </h2>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="text"
            class="mb-3"
            v-html="parseMarkdown(text)"
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
          title-tag="h3"
        />
      </div>
    </b-container>
  </div>
</template>

<script>
  import parseMarkdown from '@/utils/markdown/parse.js';

  export default {
    name: 'LandingImageCardGroup',
    components: {
      LandingImageCard: () => import('@/components/landing/LandingImageCard')
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
       * Background image Object
       */
      backgroundImage: {
        type: Object,
        default: () => {}
      },
      /**
       * List of image cards
       */
      imageCards: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        backgroundImageClasses: this.backgroundImage?.profile?.background && `bg-color-${this.backgroundImage?.profile?.background}`
      };
    },

    methods: {
      parseMarkdown
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .image-card-group {
    border-bottom: 1px solid transparent;

    &.bg-color-alternate {
      background-color: $lightgrey;

      ::v-deep .text-wrapper {
        background-color: $lightgrey;
      }
    }
  }

  .header {
    padding: 3rem 0 2rem;

    @media (min-width: $bp-medium) {
      padding: 6rem 0 5rem;
    }

    @media (min-width: $bp-4k) {
      padding: 15rem 0 14rem;
    }

    &.bg-color-highlight {
      background-color: $blue;
      color: $white;
      margin-bottom: 3rem;

      @media (min-width: $bp-medium) {
        margin-bottom: 6rem;
      }

      @media (min-width: $bp-4k) {
        margin-bottom: 15rem;
      }
    }
  }

  .header-content {
    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }

    @media (min-width: $bp-4k) {
      max-width: $max-text-column-width-landing-4k;
    }
  }
</style>

<docs lang="md">
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <div class="landing-page xxl-page">
      <LandingImageCardGroup
        title="This is a title for an image card group"
        text="A __description__ what this section is all about"
        :image-cards="[{
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0]
        }, {
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0]
        }, {
          __typename: 'ImageCard',
          name: 'Card title',
          text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          image: imagesWithAttribution[0]
        }]"
      />
    </div>
  ```
</docs>
