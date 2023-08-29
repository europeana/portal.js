<template>
  <b-container
    class="text-center"
    :class="`${variant}-container`"
  >
    <div class="header mx-auto pb-1">
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
    </div>
    <div
      v-if="infoCards.length"
      class="d-lg-flex justify-content-center mx-auto"
      :class="{'d-flex flex-wrap': variant === 'logo'}"
    >
      <LandingInfoCard
        v-for="(card, index) in infoCards"
        :key="index"
        :card="card"
        :variant="variant"
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
       * Heading title to display above the info cards
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
       * Variant for specific styles and layout
       */
      variant: {
        type: String,
        default: null
      },
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of info cards
       */
      infoCards: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    padding-top: 4rem;
    padding-bottom: 3rem;

    @media (min-width: $bp-large) {
      padding-top: 4.5rem;
    }

    &.logo-container {
      padding: 0;
    }
  }

  .header {
    max-width: $max-text-column-width;

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

    h3 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: 1.75rem;
        margin-bottom: 2rem;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.75rem);
      }
    }
  }

  .text {
    color: $mediumgrey;
  }
</style>

<docs lang="md">
  Default variant
  ```jsx
    <LandingInfoCardGroup
      title="This is a title for an info card group"
      text="A __description__ what this section is all about"
      :info-cards="[ {
        __typename: 'InfoCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }, {
      __typename: 'InfoCard',
    name: 'Usage statistics',
      text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    },
      {
        __typename: 'InfoCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      } ]"
    />
  ```

'logo' variant specific for share-your-data page
  ```jsx
    <LandingInfoCardGroup
      title="This is a title for an info card group"
      title-tag='h3'
      text="A __description__ what this section is all about"
      variant='logo'
      :info-cards="[ {
        __typename: 'InfoCard',
        name: 'Provider',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }, {
      __typename: 'InfoCard',
    name: 'Provider',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    },
      {
        __typename: 'InfoCard',
        name: 'Provider',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      },
      {
        __typename: 'InfoCard',
        name: 'Provider',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      } ]"
    />
  ```
</docs>
