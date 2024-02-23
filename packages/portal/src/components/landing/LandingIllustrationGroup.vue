<template>
  <b-container>
    <b-col class="header col-lg-8 text-center mx-auto px-0 pb-4 pb-lg-5">
      <component :is="titleTag">
        {{ title }}
      </component>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="text mb-3"
        v-html="parseMarkdownHtml(text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </b-col>
    <div
      class="cards-wrapper d-lg-flex flex-wrap justify-content-between mx-auto"
    >
      <LandingInfoCard
        v-for="(card, index) in illustrations"
        :key="index"
        :card="card"
      />
    </div>
  </b-container>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCardGroup',

    components: {
      LandingInfoCard: () => import('@/components/landing/LandingInfoCard')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * Heading title to display above the illustrations
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      },
      /**
       * Text to display under title and above the illustrations
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of illustrations
       */
      illustrations: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    padding: 0;

    @media (min-width: $bp-large) {
      padding-top: 4.5rem;
    }

    @media (min-width: $bp-4k) {
      padding-bottom: 3rem;
    }
  }

  .header {
    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;
      margin-bottom: 0.5rem;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }

    h3 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: 1.75rem;
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.75rem);
      }
    }
  }

  .text {
    color: $mediumgrey;
  }

  ::v-deep {
    .cards-wrapper {
      max-width: 1250px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center !important;

      @media (min-width: $bp-4k) {
        max-width: 1760px;
      }
    }

    .info-card {
      flex-basis: calc(50% - 2rem);
      margin: 0 1rem 1rem;
      padding: 0;
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

      .title {
        display: none;
      }
      .image-wrapper {
        flex: 0 0 100%;
        height: auto;
        width: 100%;
        max-width: 127px;

        @media (min-width: $bp-4k) {
          max-width: calc(1.5 * 127px);
        }

        img {
          mix-blend-mode: multiply; // fixes logo img with white background
        }
      }
    }
  }
</style>
