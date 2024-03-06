<template>
  <b-container
    class="landing-info-card-group text-center"
    :class="variant"
  >
    <b-col class="header col-lg-8 text-center mx-auto px-0">
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
      v-if="infoCards.length"
      class="cards-wrapper d-lg-flex flex-wrap justify-content-between text-left mx-auto"
    >
      <LandingInfoCard
        v-for="(card, index) in infoCards"
        :key="index"
        :card="card"
      />
    </div>
    <SmartLink
      v-if="link?.url"
      :destination="link.url"
      data-qa="call to action"
      class="btn btn-cta btn-secondary icon-chevron"
      hide-external-icon
    >
      {{ link.text }}
    </SmartLink>
  </b-container>
</template>

<script>
  import SmartLink from '../generic/SmartLink';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCardGroup',

    components: {
      LandingInfoCard: () => import('@/components/landing/LandingInfoCard'),
      SmartLink
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
      },
      link: {
        type: Object,
        default: null
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    margin-top: 3rem;
    margin-bottom: 3rem;

    @media (min-width: $bp-large) {
      margin-top: 6rem;
      margin-bottom: 6rem;
    }

    @media (min-width: $bp-4k) {
      margin-top: 15rem;
      margin-bottom: 15rem;
    }
  }

  .header {
    padding-bottom: 1rem;

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

  .cards-wrapper {
    max-width: 1250px;

    @media (min-width: $bp-4k) {
      max-width: 1760px;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';

  .landing-info-card-group.ds4ch {

    .header {
      @media (min-width: $bp-4k) {
        max-width: 1450px !important;
        padding-bottom: 5rem;
      }
    }

    h2 {
      @extend %title-2;
      margin-bottom: 0.75rem;

      @media (min-width: $bp-4k) {
        margin-bottom: 2rem;
      }
    }

    .text {
      color: $black;

      @media (min-width: $bp-4k) {
        font-size: 2.5rem;
        margin-bottom: 3.125rem;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingInfoCardGroup
      title="This is a title for an info card group"
      text="A __description__ what this section is all about"
      :info-cards="[{
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        }
      }, {
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        }
      },
        {
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        }
      }]"
    />
  ```
</docs>
